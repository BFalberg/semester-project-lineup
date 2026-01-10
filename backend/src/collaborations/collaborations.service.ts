import { Injectable, HttpException } from "@nestjs/common";
import { CreateCollaborationDto } from "./dto/create-collaboration.dto";
import { UpdateCollaborationDto } from "./dto/update-collaboration.dto";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Collaboration } from "./entities/collaboration.entity";
import { Genre } from "../genres/entities/genre.entity";
import { Tag } from "../tags/entities/tag.entity";
import { Skill } from "../skills/entities/skill.entity";
import { User } from "../users/entities/user.entity";

@Injectable()
export class CollaborationsService {
  constructor(
    @InjectRepository(Collaboration)
    private readonly collaborationRepository: Repository<Collaboration>,
    @InjectRepository(Genre)
    private readonly genresRepository: Repository<Genre>,
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
    @InjectRepository(Skill)
    private readonly skillsRepository: Repository<Skill>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  private mapUserFields(user: any) {
    return user
      ? {
          id: user.id,
          name: user.name,
          profile_image: user.profile_image,
        }
      : null;
  }

  private mapUsersArray(users: any[]) {
    return Array.isArray(users) ? users.map((u) => this.mapUserFields(u)) : [];
  }

  async create(createCollaborationDto: CreateCollaborationDto, userId: string): Promise<Collaboration> {
    const genres = createCollaborationDto.genreIds
      ? await this.genresRepository.findByIds(createCollaborationDto.genreIds)
      : [];
    const tags = createCollaborationDto.tagIds ? await this.tagsRepository.findByIds(createCollaborationDto.tagIds) : [];
    const skills = createCollaborationDto.skillIds
      ? await this.skillsRepository.findByIds(createCollaborationDto.skillIds)
      : [];
    const users = createCollaborationDto.userIds ? await this.usersRepository.findByIds(createCollaborationDto.userIds) : [];

    const collabData = this.collaborationRepository.create({
      ...createCollaborationDto,
      user: { id: userId },
      genres,
      tags,
      skills,
      users,
    });
    return await this.collaborationRepository.save(collabData);
  }

  async findAll(page = 1, limit = 10, genre = "", orderBy = "created", tags: string[] = []): Promise<any> {
    const query = this.collaborationRepository.createQueryBuilder("collaboration");

    if (genre) {
      query
        .innerJoin("collaboration.genres", "genreFilter", "genreFilter.title = :genre", { genre })
        .leftJoinAndSelect("collaboration.genres", "genre")
        .distinct(true);
    } else {
      query.leftJoinAndSelect("collaboration.genres", "genre");
    }

    // Add user data
    query.leftJoinAndSelect("collaboration.user", "user");

    // Add users (members) data
    query.leftJoinAndSelect("collaboration.users", "collaborationUsers");

    // Add tags join
    query.leftJoinAndSelect("collaboration.tags", "tag");

    // add skills join
    query.leftJoinAndSelect("collaboration.skills", "skill");

    // Filter by tags if provided
    if (tags.length > 0) {
      query.andWhere("tag.title IN (:...tags)", { tags });
    }

    query
      .orderBy(`collaboration.${orderBy}`, "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    const data = await query.getMany();
    // Map user fields
    const mappedData = data.map((collab) => ({
      ...collab,
      user: this.mapUserFields(collab.user),
      users: this.mapUsersArray(collab.users),
    }));
    return { data: mappedData };
  }

  async findOne(id: string): Promise<any> {
    const collabData = await this.collaborationRepository.findOne({
      where: { id },
      relations: ["user", "users"],
    });
    if (!collabData) {
      throw new HttpException("Collaboration not found", 404);
    }
    // Map user fields
    return {
      ...collabData,
      user: this.mapUserFields(collabData.user),
      users: this.mapUsersArray(collabData.users),
    };
  }

  async update(id: string, updateCollaborationDto: UpdateCollaborationDto): Promise<any> {
    if (!updateCollaborationDto || Object.keys(updateCollaborationDto).length === 0) {
      throw new HttpException("No update values provided", 400);
    }
    const existingCollab = await this.collaborationRepository.findOneBy({ id });
    if (!existingCollab) {
      throw new HttpException("Collaboration not found", 404);
    }
    const collabData = this.collaborationRepository.merge(existingCollab, updateCollaborationDto);
    const saved = await this.collaborationRepository.save(collabData);
    // Fetch with relations for mapping
    const withRelations = await this.collaborationRepository.findOne({
      where: { id: saved.id },
      relations: ["user", "users"],
    });
    if (!withRelations) {
      return null;
    }
    return {
      ...withRelations,
      user: this.mapUserFields(withRelations.user),
      users: this.mapUsersArray(withRelations.users),
    };
  }

  async remove(id: string): Promise<any> {
    const existingCollab = await this.collaborationRepository.findOneBy({ id });
    if (!existingCollab) {
      throw new HttpException("Collaboration not found", 404);
    }
    // Optionally fetch with relations for mapping before removal
    const withRelations = await this.collaborationRepository.findOne({
      where: { id },
      relations: ["user", "users"],
    });
    let mapped: any = null;
    if (withRelations) {
      mapped = {
        ...withRelations,
        user: this.mapUserFields(withRelations.user),
        users: this.mapUsersArray(withRelations.users),
      };
    }
    await this.collaborationRepository.remove(existingCollab);
    return mapped;
  }
}
