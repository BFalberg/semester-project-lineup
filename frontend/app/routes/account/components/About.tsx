import { useState } from "react";
import { useActionData, useNavigation, Link, Form } from "react-router";
import ReviewStars from "../../services/components/ReviewStars";
import SheetView from "~/components/SheetView";

import SoMeInstagram from "../../../assets/icons/SoMeInstagram.svg";
import SoMeTwitter from "../../../assets/icons/SoMeTwitter.svg";
import SoMeFacebook from "../../../assets/icons/SoMeFacebook.svg";
import SoMeYouTube from "../../../assets/icons/SoMeYouTube.svg";
import SoMeTikTok from "../../../assets/icons/SoMeTikTok.svg";
import ShowArtists from "~/components/ShowArtists";
import Icon from "~/components/icon";

import type { ProfileType } from "~/types/profile";
import type { ReviewType } from "~/types/review";
import type { QuestionType } from "~/types/question";
import ErrorMessage from "~/components/ErrorMessage";
export default function About({
  profile,
  reviews,
  avg_user_rating,
  questions,
  isCurrentUserProfile,
}: {
  profile: ProfileType;
  reviews: ReviewType[];
  avg_user_rating: number;
  questions: QuestionType[];
  isCurrentUserProfile: boolean;
}) {
  const [showArtistsILike, setShowArtistsILike] = useState(false);
  const [showPastCollabs, setShowPastCollabs] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <article className="bg-white p-4 flex flex-col gap-4 rounded-bl-3xl rounded-br-3xl">
      <section>
        <h5 className="font-normal text-gray-400! text-sm">About me</h5>
        <p className="text-sm mx-4 my-3 max-w-md">{profile.about}</p>
      </section>
      <section>
        <h5 className="font-normal text-gray-400! text-sm">What I am looking for</h5>
        <div className="flex flex-row gap-1 mx-4 my-3">
          {profile.looking_for.map((str, index) => (
            <p key={index} className={`inline-flex text-white bg-${profile.theme} capitalize px-3 py-1 rounded-full`}>
              {str}
            </p>
          ))}
        </div>
      </section>
      <section>
        <h5 className="font-normal text-gray-400! text-sm">Genres</h5>
        <div className="flex flex-row gap-1 mx-4 my-3">
          {(profile.genres ?? []).map((str, index) => (
            <p key={index} className={`inline-flex text-white bg-${profile.theme} capitalize px-3 py-1 rounded-full`}>
              {str}
            </p>
          ))}
        </div>
      </section>
      <section>
        <h5 className="font-normal text-gray-400! text-sm">Reviews</h5>
        {reviews && reviews.length > 0 ? (
          <div className="m-4 flex flex-col gap-2 items-start">
            <div className="flex gap-2 items-center">
              <ReviewStars rating={avg_user_rating} />
              <p className="text-sm text-neutral-grey">{reviews?.length} reviews</p>
            </div>
            <p className="text-sm">
              "{reviews[0].content}" - {reviews[0].sender.name}
            </p>
            <button
              className="hover:opacity-40 cursor-pointer text-neutral-grey text-sm transition-opacity duration-200 ease-in-out"
              onClick={() => setShowAllReviews(true)}
            >
              See more
            </button>
            <SheetView show={showAllReviews} onClose={() => setShowAllReviews(false)} title="All reviews">
              {reviews.map((review) => (
                <div className="flex flex-col gap-8 items-start my-2" key={review.id}>
                  <div className="flex flex-col gap-2 items-start">
                    <ReviewStars rating={review.rating} />
                    <p>"{review.content}"</p>
                    <p className="text-sm text-neutral-grey">
                      {review.sender.name} · {new Date(review.created).toLocaleDateString("da-DK")}
                    </p>
                  </div>
                </div>
              ))}
            </SheetView>
          </div>
        ) : (
          <div className="m-4">
            <p>It looks a little empty here...</p>
          </div>
        )}
      </section>
      <section>
        <h5 className="font-normal text-gray-400! text-sm">Social media</h5>
        <div className="flex flex-row gap-2 mx-2 my-3 items-center">
          {profile.instagram && (
            <Link
              to={profile.instagram}
              target="blank"
              className="hover:opacity-40 transition-opacity duration-200 ease-in-out"
            >
              <img src={SoMeInstagram} alt="Instagram" className="w-10 m-2" />
            </Link>
          )}
          {profile.twitter && (
            <Link to={profile.twitter} target="blank" className="hover:opacity-40 transition-opacity duration-200 ease-in-out">
              <img src={SoMeTwitter} alt="Twitter" className="w-10 m-2" />
            </Link>
          )}

          {profile.youtube && (
            <Link to={profile.youtube} target="blank" className="hover:opacity-40 transition-opacity duration-200 ease-in-out">
              <img src={SoMeYouTube} alt="YouTube" className="w-10 m-2" />
            </Link>
          )}
          {profile.tiktok && (
            <Link to={profile.tiktok} target="blank" className="hover:opacity-40 transition-opacity duration-200 ease-in-out">
              <img src={SoMeTikTok} alt="TikTok" className="w-10 m-2" />
            </Link>
          )}
          {profile.facebook && (
            <Link to={profile.facebook} target="blank" className="hover:opacity-40 transition-opacity duration-200 ease-in-out">
              <img src={SoMeFacebook} alt="Facebook" className="w-10 m-2" />
            </Link>
          )}
        </div>
      </section>
      <section>
        <h5 className="font-normal text-gray-400! text-sm">Artists I like (static)</h5>
        <ShowArtists
          users={["x", "x", "x", "x", "x", "x", "x", "x"]}
          theme={profile.theme}
          onShowMore={() => setShowArtistsILike(true)}
        />
        <SheetView show={showArtistsILike} onClose={() => setShowArtistsILike(false)} title="Artists I like">
          <p>Her skal der være content</p>
          <p>Her skal der være content</p>
          <p>Her skal der være content</p>
          <p>Her skal der være content</p>
          <p>Her skal der være content</p>
          <p>Her skal der være content</p>
          <p>Her skal der være content</p>
          <p>Her skal der være content</p>
          <p>Her skal der være content</p>
          <p>Her skal der være content</p>
          <p>Her skal der være content</p>
        </SheetView>
      </section>
      <section>
        <h5 className="font-normal text-gray-400! text-sm">My Music</h5>
        <div className="m-4">
          {profile.spotify_embed_link ? (
            <iframe
              data-testid="embed-iframe"
              style={{ borderRadius: 12 }}
              src={`https://open.spotify.com/embed/${profile.spotify_embed_link?.split("spotify.com/")[1]}?utm_source=generator`}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          ) : (
            <p>No music added yet.</p>
          )}
        </div>
      </section>
      <section>
        <h5 className="font-normal text-gray-400! text-sm">Videos</h5>
        {profile.videos && profile.videos.length !== 0 ? (
          <div className="m-4 flex flex-col md:grid md:grid-cols-2 gap-4">
            {profile.videos?.map((video, index) => (
              <div className="aspect-video w-full" key={index}>
                <iframe
                  className="w-full h-full"
                  style={{ borderRadius: 12 }}
                  src={`https://www.youtube.com/embed/${video?.split("?v=")[1]}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </div>
        ) : (
          <div className="m-4">
            <p>No videos added yet.</p>
          </div>
        )}
      </section>
      <section>
        <h5 className="font-normal text-gray-400! text-sm">Past collaborations (static)</h5>
        <ShowArtists
          users={["x", "x", "x", "x", "x", "x", "x", "x"]}
          theme={profile.theme}
          onShowMore={() => setShowPastCollabs(true)}
        />
        <SheetView show={showPastCollabs} onClose={() => setShowPastCollabs(false)} title="Past collaborations">
          <p>Her skal der være content</p>
          <p>Her skal der være content</p>
          <p>Her skal der være content</p>
          <p>Her skal der være content</p>
          <p>Her skal der være content</p>
          <p>Her skal der være content</p>
          <p>Her skal der være content</p>
          <p>Her skal der være content</p>
          <p>Her skal der være content</p>
          <p>Her skal der være content</p>
          <p>Her skal der være content</p>
        </SheetView>
      </section>
      <section>
        <h5 className="font-normal text-gray-400! text-sm">Questions</h5>
        <div className="m-4 flex flex-col gap-4">
          {questions && questions.length > 0 ? (
            questions
              .filter((x) => x.answer)
              .map((question) => (
                <div key={question.id}>
                  <p>
                    <b>{question.question}</b>
                  </p>
                  <p className="mx-4">{question.answer}</p>
                </div>
              ))
          ) : (
            <p>It looks a little empty here...</p>
          )}
        </div>
      </section>
      {!isCurrentUserProfile && (
        <section>
          <h5 className="font-normal text-lg">Ask me a question</h5>
          <Form method="post" action="">
            <div className={`flex items-center border-${profile.theme} border rounded-full mx-2 my-4`}>
              <input
                name="question"
                className="outline-none px-5 py-5 w-full"
                placeholder="Type your question here..."
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className={`cursor-pointer hover:opacity-40 bg-${profile.theme} text-white min-w-12 w-12 h-12 m-2 flex items-center justify-center rounded-full transition-opacity duration-200 ease-in-out`}
                disabled={isSubmitting}
              >
                <Icon name="SendDiagonal" size={24} />
              </button>
            </div>
          </Form>
          {/* Show success or error message */}
          {actionData?.error && (
            <div className="flex flex-row items-center justify-center bg-gray-100 border border-gray-200 rounded-2xl p-2 mx-2">
              <p className="text-red-500 text-sm mx-4">{actionData.error}</p>
            </div>
          )}
          {actionData?.success && (
            <div className="flex flex-row items-center justify-center bg-gray-100 border border-gray-200 rounded-2xl p-2 mx-2">
              <p className="text-green-500 text-sm mx-4">
                Question submitted successfully! The question will appear when it has been answered by{" "}
                {profile.name.split(" ")[0]}.
              </p>
            </div>
          )}
        </section>
      )}
    </article>
  );
}
