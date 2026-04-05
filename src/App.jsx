import React, { useState } from "react";
import coverImage from "../cover.jpg";

const amazonLink =
  "https://www.amazon.com/Quiet-Cost-Stepparents-Parental-Alienation/dp/B0GQNJJWHM/";

const problemPoints = [
  "Your child suddenly pulls away without explanation",
  "They repeat things that don't sound like them",
  "They seem cold or distant after visits",
  "You feel like you're losing them and don't know why",
];

const understandingCards = [
  "How parental alienation actually works",
  "Why your child's behavior changed",
  "The hidden patterns most people miss",
  "What you can do without making it worse",
  "How to protect your relationship long-term",
];

const previews = [
  '"Alienation rarely begins with one dramatic moment. It begins with repetition, pressure, and the child\'s need to stay emotionally safe."',
  '"A child can love you and still reject you when loyalty becomes the price of peace."',
  '"The most painful part is not just the distance. It is watching your child speak in a voice that is no longer their own."',
  '"This book is about seeing the pattern clearly enough that you stop blaming yourself for what was being built around you."',
];

const reactions = [
  '"I finally had language for what I\'ve been living."',
  '"This made me feel seen in a way nothing else has."',
  '"Direct, painful, validating, and impossible to ignore."',
];

function SectionLabel({ children, dark = false }) {
  return (
    <span
      className={[
        "mb-4 inline-flex rounded-full px-4 py-1 text-xs font-bold uppercase tracking-[0.32em]",
        dark
          ? "border border-[#d0b8aa] bg-white/60 text-[#5b4940]"
          : "border border-white/10 bg-white/5 text-fog/80",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export default function App() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setFormMessage("Enter your email to get the guide.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormMessage("");

      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: "landing-page-guide-form",
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to send the guide.");
      }

      setSubmitted(true);
      setFormMessage(payload.message || "The guide has been sent to your inbox.");
      setEmail("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to send the guide.";
      setSubmitted(false);
      setFormMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewHighlights = [
    "You start seeing the difference between normal co-parenting conflict and a sustained campaign of emotional influence.",
    "You understand why your child may seem distant, scripted, or suddenly fearful without a clear event to explain it.",
    "You learn how to respond in ways that protect the bond instead of feeding the pattern.",
  ];

  return (
    <div className="relative overflow-hidden bg-grain text-sand">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-[-10%] top-0 h-80 w-80 rounded-full bg-ember/20 blur-3xl" />
        <div className="absolute bottom-24 right-[-8%] h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      <main className="relative">
        <section className="border-b border-white/10">
          <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
            <div className="animate-rise max-w-2xl">
              <SectionLabel>The Quiet Cost</SectionLabel>
              <h1 className="max-w-4xl font-serif text-5xl font-semibold leading-[0.92] text-sand sm:text-6xl lg:text-7xl">
                When Your Child Turns Against You
                <span className="text-ember"> - And You Don&apos;t Know Why</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-fog sm:text-xl">
                Understanding parental alienation, loyalty conflicts, and
                silent manipulation
              </p>
              <p className="mt-8 max-w-xl text-base leading-7 text-fog/80 sm:text-lg">
                A direct, emotionally honest nonfiction book for parents trying
                to make sense of sudden rejection, distorted narratives, and
                the slow fracture of a once-secure bond.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href={amazonLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-ember px-7 py-4 text-base font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#cf5b47] hover:shadow-glow"
                >
                  Get the Book
                </a>
                <a
                  href="#free-download"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-4 text-base font-bold text-sand transition duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
                >
                  Download Free Guide
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-6 text-sm text-fog/75">
                <span>Evidence-based patterns</span>
                <span>Emotional validation</span>
                <span>Practical next steps</span>
              </div>
            </div>

            <div className="animate-float relative mx-auto w-full max-w-xl">
              <div className="absolute inset-x-10 bottom-4 h-12 rounded-full bg-black/40 blur-2xl" />
              <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-glow backdrop-blur">
                <div className="absolute -left-4 top-8 hidden max-w-[180px] rounded-2xl border border-white/10 bg-[#171a1e]/90 p-4 text-sm leading-6 text-fog shadow-2xl lg:block">
                  For the parent who knows something is wrong but can&apos;t yet
                  prove it.
                </div>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="group block w-full text-left"
                  aria-label="Open book preview"
                >
                  <img
                    src={coverImage}
                    alt="The Quiet Cost book cover"
                    className="w-full rounded-[1.5rem] object-cover transition duration-300 group-hover:scale-[1.01]"
                  />
                  <span className="mt-4 block text-center text-sm font-bold uppercase tracking-[0.26em] text-fog/80 transition group-hover:text-sand">
                    Tap the cover to preview the book
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-24 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <SectionLabel>Problem Identification</SectionLabel>
              <h2 className="font-serif text-4xl font-semibold text-sand sm:text-5xl">
                This may be happening to you if...
              </h2>
            </div>

            <div className="grid gap-4">
              {problemPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-ember/40 hover:bg-white/10"
                >
                  <div className="flex items-start gap-4">
                    <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ember/15 text-sm font-bold text-ember">
                      +
                    </span>
                    <p className="text-lg leading-8 text-fog">{point}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-24 lg:px-10">
          <div className="rounded-[2rem] border border-ember/30 bg-ember/10 px-8 py-10 text-center shadow-glow backdrop-blur">
            <p className="font-serif text-3xl font-semibold leading-tight text-sand sm:text-4xl">
              You are not imagining this. You are not alone. And you are not
              the problem.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="mb-12 max-w-2xl">
            <SectionLabel>What This Book Reveals</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold text-sand sm:text-5xl">
              What You&apos;ll Understand
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {understandingCards.map((item, index) => (
              <article
                key={item}
                className="group flex min-h-[220px] flex-col justify-between rounded-[1.75rem] border border-white/10 bg-[#16191d]/90 p-6 transition duration-300 hover:-translate-y-1.5 hover:border-ember/40"
              >
                <span className="text-sm font-bold tracking-[0.25em] text-ember/80">
                  0{index + 1}
                </span>
                <p className="mt-8 text-2xl font-semibold leading-8 text-sand">
                  {item}
                </p>
                <div className="mt-8 h-px w-full bg-gradient-to-r from-ember/60 to-transparent transition duration-300 group-hover:from-ember" />
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-black/10">
          <div className="mx-auto max-w-5xl px-6 py-24 text-center lg:px-10">
            <SectionLabel>Author Authority</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold text-sand sm:text-5xl">
              Not theory. Lived experience.
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-fog">
              This book documents a 15-year experience in real time: the
              patterns, the evidence, the repeating tactics, and the long-term
              emotional consequences. It is written from inside the reality of
              alienation, not from a distance.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="mb-12 max-w-2xl">
            <SectionLabel>Book Preview</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold text-sand sm:text-5xl">
              A preview of the insights inside
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {previews.map((quote) => (
              <blockquote
                key={quote}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-xl leading-9 text-fog shadow-[0_18px_55px_rgba(0,0,0,0.16)]"
              >
                {quote}
              </blockquote>
            ))}
          </div>
        </section>

        <section
          id="free-download"
          className="mx-auto max-w-5xl px-6 py-24 lg:px-10"
        >
          <div className="rounded-[2rem] border border-white/10 bg-[#efe4d2] p-8 text-ink shadow-[0_25px_90px_rgba(0,0,0,0.24)] sm:p-12">
            <SectionLabel dark>Free Lead Magnet</SectionLabel>
            <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-rust">
                  If your child has changed and you can&apos;t explain why...
                  start here.
                </p>
                <h2 className="font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">
                  Free Download
                </h2>
                <p className="mt-5 text-2xl leading-9 text-rust">
                  17 Signs Your Child May Be Experiencing Parental Alienation
                </p>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-[#43352f]">
                  Enter your email to get the guide and start recognizing the
                  patterns earlier, with more clarity and less self-doubt.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold uppercase tracking-[0.2em] text-[#5b4940]">
                    Email Address
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    disabled={isSubmitting}
                    className="w-full rounded-full border border-[#d8c5b6] bg-white px-6 py-4 text-base text-ink outline-none transition focus:border-rust"
                  />
                </label>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-ink px-7 py-4 text-base font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#1d2126]"
                >
                  {isSubmitting ? "Sending Guide..." : "Download Free Guide"}
                </button>
                <p className="min-h-[24px] text-sm text-[#5b4940]">
                  {submitted
                    ? formMessage || "You're on the list. The guide is on its way."
                    : formMessage || "No spam. Just the guide and future resources."}
                </p>
              </form>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-24 lg:px-10">
          <div className="mb-12 max-w-2xl">
            <SectionLabel>Reader Reactions</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold text-sand sm:text-5xl">
              What readers feel
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {reactions.map((reaction) => (
              <div
                key={reaction}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-7 text-lg leading-8 text-fog transition duration-300 hover:-translate-y-1 hover:border-white/20"
              >
                {reaction}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-24 pt-8 text-center lg:px-10">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 px-8 py-12">
            <h2 className="font-serif text-4xl font-semibold leading-tight text-sand sm:text-5xl">
              If you&apos;re trying to understand what&apos;s happening to your
              child... this is where you start.
            </h2>
            <a
              href={amazonLink}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-ember px-8 py-4 text-base font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#cf5b47] hover:shadow-glow"
            >
              Get the Book
            </a>

            <div className="mt-10 flex items-center justify-center gap-4 text-fog/80">
              <a
                href="https://www.instagram.com/kelainewrites/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-sand"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-current"
                >
                  <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 1.8A3.7 3.7 0 0 0 3.8 7.5v9a3.7 3.7 0 0 0 3.7 3.7h9a3.7 3.7 0 0 0 3.7-3.7v-9a3.7 3.7 0 0 0-3.7-3.7h-9Zm9.45 1.35a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1ZM12 6.85A5.15 5.15 0 1 1 6.85 12 5.16 5.16 0 0 1 12 6.85Zm0 1.8A3.35 3.35 0 1 0 15.35 12 3.35 3.35 0 0 0 12 8.65Z" />
                </svg>
                Follow the Author on Instagram
              </a>
            </div>
          </div>
        </section>

        {isPreviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-sm">
            <div className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-[2rem] border border-white/10 bg-[#171b1f] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:p-10">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-sand transition hover:bg-white/10"
                aria-label="Close preview"
              >
                ×
              </button>

              <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <img
                    src={coverImage}
                    alt="The Quiet Cost book cover preview"
                    className="w-full rounded-[1.25rem] object-cover"
                  />
                </div>

                <div>
                  <SectionLabel>Book Preview</SectionLabel>
                  <h3 className="font-serif text-4xl font-semibold text-sand sm:text-5xl">
                    Read what the book helps you finally see
                  </h3>
                  <p className="mt-5 max-w-2xl text-lg leading-8 text-fog">
                    This is not abstract theory. It is a direct look at the
                    patterns, phrases, shifts in behavior, and emotional
                    pressure that make a parent feel like they are losing their
                    child in slow motion.
                  </p>

                  <div className="mt-8 space-y-4">
                    {previewHighlights.map((item) => (
                      <div
                        key={item}
                        className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
                      >
                        <p className="text-base leading-7 text-fog">{item}</p>
                      </div>
                    ))}
                  </div>

                  <blockquote className="mt-8 rounded-[1.75rem] border border-ember/20 bg-ember/10 p-6 font-serif text-2xl leading-9 text-sand">
                    &quot;A child can love you and still reject you when loyalty
                    becomes the price of peace.&quot;
                  </blockquote>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <a
                      href={amazonLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-ember px-7 py-4 text-base font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#cf5b47] hover:shadow-glow"
                    >
                      Get the Book
                    </a>
                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(false)}
                      className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-4 text-base font-bold text-sand transition duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
                    >
                      Continue Reading the Page
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
