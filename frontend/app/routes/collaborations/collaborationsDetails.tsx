import { useLoaderData, Link, Await } from "react-router";
import Badge from "~/components/Badge";
import Icon from "~/components/icon";
import { apiFetch } from "~/lib/apiFetch";
import Button from "~/components/Button";

import type { MetaFunction } from "react-router";
import fromNowDate from "~/lib/fromNowDate";
import { getCollaboration } from "~/lib/data/collaborationData";
import { Suspense } from "react";
import type { Tag } from "~/types/tag";

export const meta: MetaFunction = ({ matches }) => {
  const routeData = matches.find((match: any) => match.id === "routes/collaborations/collaborationsDetails")?.loaderData as any;
  const collabTitle = routeData?.collaboration?.data?.title ?? "Collaboration";

  return [
    { title: `${collabTitle} | LineUp` },
    {
      property: "og:title",
      content: `${collabTitle} | LineUp`,
    },
  ];
};

export async function clientLoader({ params }: { params: { collaborationId: string } }): Promise<{}> {
  const collaboration = await getCollaboration(params.collaborationId);

  return { collaboration };
}

function CollabHeader({
  users,
  role,
  created,
}: {
  users: Array<{ id: string; name: string; profile_image: string }>;
  role: string;
  created: Date;
}) {
  const formatNames = (names: string[]) => {
    const firstNames = names.map((n) => n.split(" ")[0]);
    if (firstNames.length === 0) return "";
    if (firstNames.length === 1) return firstNames[0];
    if (firstNames.length === 2) return `${firstNames[0]} and ${firstNames[1]}`;
    return `${firstNames.slice(0, -1).join(", ")} and ${firstNames[firstNames.length - 1]}`;
  };

  const allNames = users.map((u) => u.name);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 flex-wrap">
        <div className={`flex ${users.length > 1 ? "-space-x-2" : ""}`}>
          {users.slice(0, 4).map((user, i) => (
            <Link key={user.id} to={`/profile/${user.id}`}>
              <img
                key={user.id}
                src={user.profile_image}
                alt={user.name}
                className="relative size-10 object-cover rounded-full ring-2 ring-white"
                style={{ zIndex: 100 - i }}
              />
            </Link>
          ))}
          {users.length > 4 && (
            <div
              className="relative size-10 rounded-full bg-neutral-200 text-xs flex items-center justify-center ring-2 ring-white"
              style={{ zIndex: 96 }}
            >
              +{users.length - 4}
            </div>
          )}
        </div>
        <span>{formatNames(allNames)}</span>
        <span className="text-gray-400">looking for a</span>
        <span className="text-gray-400">#{role}</span>
      </div>
      <span className="text-gray-400">{fromNowDate({ date: created })}</span>
    </div>
  );
}

function CollabTags({ tags }: { tags: Tag[] }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tags.map((tag) => {
        const tagText = typeof tag === "string" ? tag : tag?.title || "";
        return <Badge key={tagText} text={tagText} Variant="outline" color="neutral-grey" />;
      })}
    </div>
  );
}

function CollabTitle({ title }: { title: string }) {
  return <h1 className="">{title}</h1>;
}

function CollabImage({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="w-full h-64 bg-gray-200 rounded-3xl overflow-hidden">
      {imageUrl && <img src={imageUrl} alt="Collaboration" className="w-full h-full object-cover" />}
    </div>
  );
}

function CollabContent({ content }: { content: string }) {
  return <p className="text-gray-700">{content}</p>;
}

function CollabChat({ collabId, userId }: { collabId: string; userId: string }) {
  return (
    <div className="mt-auto flex items-center justify-between gap-4">
      {/* NOTE - The collaboration id is added as a param for future reference if we add group chats or specific collaboration chats. */}
      <Link to={`/chats/new?collaborationId=${collabId}&userId=${userId}`}>
        <Button text="Start Chat" variant="primary" icon="ChatBubble" />
      </Link>
    </div>
  );
}

function CollabGenres({ genres }: { genres: { title: string }[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h3>Genre</h3>
      <div className="flex items-center gap-2 flex-wrap">
        {genres.map((genre) => (
          <Badge key={genre.title} color="header-bg-1" text={genre.title} />
        ))}
      </div>
    </div>
  );
}

function CollabSkills({ skills }: { skills: { title: string }[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h3>Must have skills</h3>
      <div className="flex items-center gap-2 flex-wrap">
        {skills.map((skill) => (
          <Badge key={skill.title} color="header-bg-1" text={skill.title} />
        ))}
      </div>
    </div>
  );
}

export default function CollaborationDetails() {
  const { collaboration } = useLoaderData() as any;
  const collab = collaboration.data;

  const extraUsers = (collab.users ?? []).filter((u: any) => u.id !== collab.user.id);
  const allUsers = [collab.user, ...extraUsers];

  return (
    <div className="px-4 flex flex-col gap-4 outer-wrapper" style={{ viewTransitionName: `collaboration-${collab.id}` }}>
      <CollabHeader users={allUsers} role={collab.role} created={collab.created} />
      <CollabTags tags={collab.tags} />
      <CollabTitle title={collab.title} />
      <CollabImage imageUrl={collab.media} />
      <CollabContent content={collab.content} />
      <CollabChat collabId={collab.id} userId={collab.user.id} />
      <CollabGenres genres={collab.genres} />
      <CollabSkills skills={collab.skills} />
    </div>
  );
}
