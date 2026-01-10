import { Link, useLoaderData } from "react-router";
import Badge from "~/components/Badge";
import Icon from "~/components/icon";
import Button from "~/components/Button";
import fromNowDate from "~/lib/fromNowDate";
import type { Tag } from "~/types/tag";
import type { Collaboration } from "~/types/collaborations";
import { InfiniteScroll } from "~/components/InfiniteScroll";
import { getAllCollaborations } from "~/lib/data/collaborationData";
import CollaborationsCardRedacted from "./CollaborationsCardRedacted";

function CollabCard({ children, id }: React.PropsWithChildren<{ id: string }>) {
  return (
    <div
      className="bg-white border border-black/10 p-4 rounded-3xl overflow-hidden flex flex-col gap-4 h-full"
      style={{ viewTransitionName: `collaboration-${id}` }}
    >
      {children}
    </div>
  );
}

function CollabCardHeader({
  users,
  role,
}: {
  users: Array<{ id: string; name: string; profile_image: string }>;
  role: string;
}) {
  const formatNames = (names: string[]) => {
    const firstNames = names.map((name) => name.split(" ")[0]);
    if (firstNames.length === 0) return "";
    if (firstNames.length === 1) return firstNames[0];
    if (firstNames.length === 2) return `${firstNames[0]} and ${firstNames[1]}`;
    return `${firstNames.slice(0, -1).join(", ")} and ${firstNames[firstNames.length - 1]}`;
  };

  const allNames = users.map((u) => u.name);

  return (
    <div className="flex items-center gap-2 border-b border-gray-200 pb-2 ">
      <div className={`flex ${users.length > 1 ? "-space-x-2" : ""}`}>
        {users.slice(0, 4).map((user, i) => (
          <Link to={`/profile/${user.id}`}>
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
      <div className="flex gap-1">
        <span>{formatNames(allNames)}</span>
        <span className="text-gray-400">
          looking for a <span className="lowercase">#{role}</span>
        </span>
      </div>
    </div>
  );
}

function CollabCardTitle({ title }: { title: string }) {
  return <h3 className="text-lg font-bold leading-tight text-gray-900">{title}</h3>;
}

function CollabCardMeta({ location, created, tags }: { location: string; created: Date; tags: Tag[] }) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        {tags.map((tag: Tag, idx: number) => (
          <Badge key={idx} Variant="outline" color="neutral-grey" text={tag.title} />
        ))}
      </div>
      <div className="text-xs text-gray-400">
        <span>{location}</span>
        <span> - </span>
        <span>{fromNowDate({ date: created })}</span>
      </div>
    </div>
  );
}

function CollabCardImage({ media, alt }: { media: string; alt: string }) {
  return media ? (
    <img className="rounded-3xl aspect-post md:aspect-video w-full" src={media} alt={alt} />
  ) : // <div className="rounded-3xl bg-light-grey aspect-post md:aspect-video w-full" />
  null;
}

function CollabCardContent({ content }: { content: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">
        {content.split(" ").length > 15 ? content.split(" ").slice(0, 15).join(" ") + "..." : content}
      </p>
    </div>
  );
}

function CollabCardActions({ collabId, userId }: { collabId: string; userId: string }) {
  return (
    <div className="mt-auto flex items-center justify-between gap-4">
      <Link className="text-gray-600 font-bold text-sm" to={`/collaborations/${collabId}`} viewTransition>
        Read more
      </Link>

      {/*NOTE - The collaboration id is added as a param for future reference if we add group chats or specific collaboration chats. */}
      <Link to={`/chats/new?collaborationId=${collabId}&userId=${userId}`}>
        <Button variant="primary" text="Start Chat" icon="ChatBubble" />
      </Link>
    </div>
  );
}

function CollaborationsCard({ collab }: { collab: Collaboration }) {
  const extraUsers = (collab.users ?? []).filter((u: any) => u.id !== collab.user.id);
  const allUsers = [collab.user, ...extraUsers];
  return (
    <CollabCard key={collab.id} id={collab.id}>
      <CollabCardHeader users={allUsers} role={collab.role} />
      <CollabCardTitle title={collab.title} />
      <CollabCardMeta location={collab.location} created={collab.created} tags={collab.tags} />
      <CollabCardImage media={collab.media} alt={collab.title} />
      <CollabCardContent content={collab.content} />
      <CollabCardActions collabId={collab.id} userId={collab.user.id} />
    </CollabCard>
  );
}

export default function CollaborationsFeed({ collaborations }: { collaborations: Collaboration[] }) {
  return (
    <div className="outer-wrapper">
      <InfiniteScroll<Collaboration>
        fetchPage={getAllCollaborations}
        initialData={collaborations}
        pageSize={10}
        loader={<CollaborationsCardRedacted />}
        className="flex flex-col gap-4"
        renderItem={(collab) => <CollaborationsCard key={collab.id} collab={collab} />}
      />
    </div>
  );
}
