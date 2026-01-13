import { useState } from "react";
import { useLoaderData, useActionData, useNavigation, Form } from "react-router";
import { apiFetch } from "~/lib/apiFetch";
import SoMeInstagram from "../../assets/icons/SoMeInstagram.svg";
import SoMeTwitter from "../../assets/icons/SoMeTwitter.svg";
import SoMeFacebook from "../../assets/icons/SoMeFacebook.svg";
import SoMeYouTube from "../../assets/icons/SoMeYouTube.svg";
import SoMeTikTok from "../../assets/icons/SoMeTikTok.svg";
import type { QuestionType } from "~/types/question";
import EditArray from "../../components/EditArray";
import Button from "~/components/Button";
import Input from "~/components/Input";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Edit profile | LineUp" },
    {
      property: "og:title",
      content: "Edit profile | LineUp",
    },
    // {
    //   name: "description",
    //   content: "This app is the best",
    // },
  ];
};

export async function clientLoader() {
  const profileResponse = await apiFetch(`/user/`);

  if (!profileResponse.ok) {
    throw new Error("Unknown error.");
  }

  if (profileResponse.status === 404) {
    throw new Response("Profile not found", { status: 404 });
  }

  const profile = await profileResponse.json();

  const questionsResponse = await apiFetch(`/user/${profile.data.id}/questions`);
  const genresResponse = await apiFetch(`/genres`);

  if (!questionsResponse.ok || !genresResponse.ok) {
    throw new Error("Unknown error.");
  }

  const questions = await questionsResponse.json();
  const genres = await genresResponse.json();

  return {
    profile,
    questions,
    genres,
  };
}

export async function clientAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const profileId = formData.get("profile_id")?.toString();
  const questionsResponse = await apiFetch(`/user/${profileId}/questions`);
  const questions = (await questionsResponse.json()).data;

  // Build array of { id, answer } with the data from the form.
  const answers = questions.map((q: { id: string }) => ({
    id: q.id,
    answer: formData.get(q.id)?.toString() ?? "",
  }));

  // Now you can send this array to your backend
  await apiFetch(`/questions/user/${profileId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questions: answers }),
  });

  const name = formData.get("name")?.toString();
  const bio = formData.get("bio")?.toString();
  const about = formData.get("about")?.toString();
  const looking_for = formData.get("looking_for")?.toString();
  const genres = formData.get("genres")?.toString();
  const theme = formData.get("theme")?.toString();
  const instagram = formData.get("instagram")?.toString();
  const twitter = formData.get("twitter")?.toString();
  const youtube = formData.get("youtube")?.toString();
  const tiktok = formData.get("tiktok")?.toString();
  const facebook = formData.get("facebook")?.toString();
  const spotify_embed_link = formData.get("spotify_embed_link")?.toString();
  const videos = formData.get("videos")?.toString();

  // Validate question content

  if (!name || !name.trim()) {
    return { error: "Name cannot be empty" };
  }

  if (!bio || !bio.trim()) {
    return { error: "Bio cannot be empty" };
  }

  if (!about || !about.trim()) {
    return { error: "About cannot be empty" };
  }

  try {
    const response = await apiFetch(`/user/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        bio: bio.trim(),
        about: about.trim(),
        looking_for: looking_for
          ? looking_for
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        genres: genres
          ? genres
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        theme: theme?.trim(),
        instagram: instagram?.trim(),
        twitter: twitter?.trim(),
        youtube: youtube?.trim(),
        tiktok: tiktok?.trim(),
        facebook: facebook?.trim(),
        spotify_embed_link: spotify_embed_link?.trim(),
        videos: videos
          ? videos
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
      }),
    });

    // Check for validation errors (400)
    if (response.status === 400) {
      const error = await response.json();
      return { error: error.error || "Invalid profile data" };
    }

    // Check for other errors
    if (!response.ok) {
      return { error: `Failed to submit profile edit request: ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

export default function ProfileEdit() {
  const { profile, questions, genres } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();

  const [userGenres, setUserGenres] = useState(profile.data.genres);
  const [userLookingFor, setUserLookingFor] = useState(profile.data.looking_for);
  const [userVideos, setUserVideos] = useState(profile.data.videos);

  return (
    <article className="outer-wrapper">
      <Form method="post">
        <input type="hidden" name="profile_id" value={profile.data.id} />
        <section className="flex flex-col items-center justify-center gap-4">
          <img
            src="https://loremflickr.com/640/480?lock=702965218279424"
            className="bg-black w-36 h-36 rounded-full object-cover"
            alt="profile picture"
          />
          <button
            className="text-neutral-grey font-bold text-sm hover:opacity-50 transition-opacity duration-200 ease-in-put cursor-pointer"
            onClick={() => alert("Her skal der være billedeupload functionality.")}
          >
            Edit picture
          </button>
        </section>
        <section className="m-4 bg-white rounded-3xl border border-gray-200 text-sm">
          <div className="p-4 flex gap-4">
            <p className="py-2 w-20 min-w-20">Name</p>
            <input
              type="text"
              name="name"
              placeholder="First and last name"
              className="flex-1 p-2 border-b border-b-gray-200"
              defaultValue={profile.data.name}
            />
          </div>
          <div className="p-4 flex gap-4">
            <p className="py-2 w-20 min-w-20">Bio</p>
            <input
              type="text"
              name="bio"
              placeholder="Short biography"
              className="flex-1 p-2 border-b border-b-gray-200"
              defaultValue={profile.data.bio}
            />
          </div>
          <div className="p-4 flex gap-4">
            <p className="py-2 w-20 min-w-20">About me</p>
            <textarea
              placeholder="Who am I?"
              name="about"
              className="flex-1 p-2 border-b border-b-gray-200 min-h-20 max-h-40"
              defaultValue={profile.data.about}
            />
          </div>
          <div className="p-4 flex gap-4 flex-col sm:flex-row">
            <p className="py-2 w-20 min-w-20">What I am looking for</p>
            <EditArray
              array={userLookingFor ?? []}
              editableText={true}
              placeholder="Write what you're looking for..."
              onChange={(e: string[]) => setUserLookingFor(e)}
            />
            <input value={userLookingFor.toString()} name="looking_for" type="hidden" />
          </div>
          <div className="p-4 flex gap-4 flex-col md:flex-row">
            <p className="py-2 w-20 min-w-20">Genres</p>
            <EditArray
              array={userGenres ?? []}
              editableText={false}
              selectOptions={genres.data.map((genre: { id: string; title: string }) => genre.title)}
              placeholder="Pick genre..."
              onChange={(e: string[]) => setUserGenres(e)}
            />
            {userGenres?.length === 0 && <p className="text-xs text-neutral-500 mt-2">You have not added any genres yet.</p>}
            <input value={(userGenres ?? []).join(",")} name="genres" type="hidden" />
          </div>
          <div className="p-4 flex gap-4 flex-col md:flex-row">
            <p className="py-2 w-20 min-w-20">Theme</p>
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center justify-center gap-2">
                <label htmlFor="header-bg-1">
                  <div className="bg-header-bg-1 w-8 h-8 rounded-full"></div>
                </label>
                <input
                  type="radio"
                  id="header-bg-1"
                  name="theme"
                  value="header-bg-1"
                  defaultChecked={profile.data.theme === "header-bg-1"}
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <label htmlFor="header-bg-2">
                  <div className="bg-header-bg-2 w-8 h-8 rounded-full"></div>
                </label>
                <input
                  type="radio"
                  id="header-bg-2"
                  name="theme"
                  value="header-bg-2"
                  defaultChecked={profile.data.theme === "header-bg-2"}
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <label htmlFor="header-bg-3">
                  <div className="bg-header-bg-3 w-8 h-8 rounded-full"></div>
                </label>
                <input
                  type="radio"
                  id="header-bg-3"
                  name="theme"
                  value="header-bg-3"
                  defaultChecked={profile.data.theme === "header-bg-3"}
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <label htmlFor="header-bg-4">
                  <div className="bg-header-bg-4 w-8 h-8 rounded-full"></div>
                </label>
                <input
                  type="radio"
                  id="header-bg-4"
                  name="theme"
                  value="header-bg-4"
                  defaultChecked={profile.data.theme === "header-bg-4"}
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <label htmlFor="header-bg-5">
                  <div className="bg-header-bg-5 w-8 h-8 rounded-full"></div>
                </label>
                <input
                  type="radio"
                  id="header-bg-5"
                  name="theme"
                  value="header-bg-5"
                  defaultChecked={profile.data.theme === "header-bg-5"}
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <label htmlFor="header-bg-6">
                  <div className="bg-header-bg-6 w-8 h-8 rounded-full"></div>
                </label>
                <input
                  type="radio"
                  id="header-bg-6"
                  name="theme"
                  value="header-bg-6"
                  defaultChecked={profile.data.theme === "header-bg-6"}
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <label htmlFor="header-bg-7">
                  <div className="bg-header-bg-7 w-8 h-8 rounded-full"></div>
                </label>
                <input
                  type="radio"
                  id="header-bg-7"
                  name="theme"
                  value="header-bg-7"
                  defaultChecked={profile.data.theme === "header-bg-7"}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="m-4 bg-white rounded-3xl border border-gray-200 text-sm">
          <div className="p-4 flex gap-4 flex-col md:flex-row">
            <p className="py-2 w-20 min-w-20">Social media</p>
            <div className="flex flex-row flex-wrap gap-4 my-3 items-center">
              <p className="text-xs text-neutral-500">Leave a field empty to hide from your profile.</p>
              <div className="flex w-full gap-2">
                <Input
                  name="instagram"
                  variant="onboarding"
                  placeholder="Instagram link"
                  className="flex-1"
                  defaultValue={`${profile.data.instagram}`}
                />
                <img src={SoMeInstagram} alt="Instagram" className="w-8" />
              </div>
              <div className="flex w-full gap-2">
                <Input
                  name="twitter"
                  variant="onboarding"
                  placeholder="Twitter link"
                  className="flex-1"
                  defaultValue={`${profile.data.twitter}`}
                />
                <img src={SoMeTwitter} alt="Twitter" className="w-8" />
              </div>
              <div className="flex w-full gap-2">
                <Input
                  name="youtube"
                  variant="onboarding"
                  placeholder="YouTube link"
                  className="flex-1"
                  defaultValue={`${profile.data.youtube}`}
                />
                <img src={SoMeYouTube} alt="YouTube" className="w-8" />
              </div>
              <div className="flex w-full gap-2">
                <Input
                  name="tiktok"
                  variant="onboarding"
                  placeholder="TikTok link"
                  className="flex-1"
                  defaultValue={`${profile.data.tiktok}`}
                />
                <img src={SoMeTikTok} alt="TikTok" className="w-8" />
              </div>
              <div className="flex w-full gap-2">
                <Input
                  name="facebook"
                  variant="onboarding"
                  placeholder="Facebook link"
                  className="flex-1"
                  defaultValue={`${profile.data.facebook}`}
                />
                <img src={SoMeFacebook} alt="Facebook" className="w-8" />
              </div>
            </div>
          </div>
        </section>
        <section className="m-4 bg-white rounded-3xl border border-gray-200 text-sm">
          <div className="p-4 flex gap-4 flex-col md:flex-row">
            <p className="py-2 w-20 min-w-20">My music</p>
            {/* <iframe
            data-testid="embed-iframe"
            style={{ borderRadius: 12 }}
            src={`https://open.spotify.com/embed/${profile.data.spotify_embed_link?.split("spotify.com/")[1]}?utm_source=generator`}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe> */}
            <div className="gap-2 flex flex-col my-3 w-full">
              <p className="text-xs text-neutral-500">Input your Spotify artist link to display your music.</p>
              <Input
                variant="onboarding"
                name="spotify_embed_link"
                placeholder="Spotify artist link"
                className="flex-1"
                defaultValue={`${profile.data.spotify_embed_link}`}
              />
            </div>
          </div>
        </section>
        <section className="m-4 bg-white rounded-3xl border border-gray-200 text-sm">
          <div className="p-4 flex gap-4 flex-col md:flex-row">
            <p className="py-2 w-20 min-w-20">Videos</p>
            <div className="gap-2 flex flex-col my-3 w-full">
              <p className="text-xs text-neutral-500">Add YouTube links to display videos on your profile.</p>
              <EditArray
                array={userVideos ?? []}
                editableText={true}
                placeholder="Input a YouTube URL..."
                onChange={(e: string[]) => setUserVideos(e)}
              />
              <input value={userVideos.toString()} name="videos" className="hidden" />
            </div>
          </div>
        </section>
        <section className="m-4 bg-white rounded-3xl border border-gray-200 text-sm">
          <div className="p-4 flex flex-col gap-4">
            <p className="py-2 w-20 min-w-20">Questions</p>
            <p className="text-xs text-neutral-500">Answered questions will appear on your profile.</p>
            {questions.data.map((q: QuestionType, index: number) => (
              <div className="mx-4" key={q.id}>
                <p className="font-bold">{q.question}</p>
                <Input
                  variant="onboarding"
                  name={`${q.id}`}
                  placeholder="Write your answer..."
                  className="flex-1 w-full"
                  defaultValue={q.answer ?? ""}
                />
              </div>
            ))}
          </div>
        </section>
        <section className="flex justify-center my-6">
          <Button type="submit" variant="primary" text="Save profile" icon="Check"></Button>
        </section>
        {/* Display success message */}
        {actionData?.success && (
          <div className="m-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            Profile updated successfully!
          </div>
        )}

        {/* Display error message */}
        {actionData?.error && (
          <div className="m-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{actionData.error}</div>
        )}
      </Form>
    </article>
  );
}
