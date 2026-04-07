import { FC } from "react";
import * as prismic from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";

import { Section } from "@/components/layout/section";
import { SectionIntro } from "@/components/common/section-intro";
import { SocialLinks } from "@/components/common/social-links";
import { Reveal } from "@/components/motion/reveal";
import { getGlobalNavSocialLinks } from "@/lib/global-nav";
import {
  renderSectionSubtext,
  renderSectionTitle,
} from "@/lib/prismic-rich-text";
import { getSectionAnchorId } from "@/lib/utils";

type ProfileFeatureSlice = {
  id: string;
  primary: {
    section_id: prismic.KeyTextField;
    label: prismic.KeyTextField;
    title: prismic.RichTextField;
    subtext: prismic.RichTextField;
    image: prismic.ImageField;
    left_overlay_text: prismic.RichTextField;
    right_overlay_text: prismic.RichTextField;
    show_social_links: boolean;
  };
  items: [];
  slice_label: string | null;
  slice_type: "profile_feature";
  variation: "default";
  version: string;
};

export type ProfileFeatureProps = SliceComponentProps<ProfileFeatureSlice>;

const ProfileFeature: FC<ProfileFeatureProps> = async ({ slice }) => {
  const showSocialLinks = slice.primary.show_social_links !== false;
  const socialLinks = showSocialLinks
    ? await getGlobalNavSocialLinks()
    : [];
  const sectionId = getSectionAnchorId(slice.primary.section_id);

  return (
    <section
      className="bg-rose-white py-16 text-night scroll-mt-24 sm:scroll-mt-28 sm:py-20 lg:scroll-mt-32 lg:py-24"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id={sectionId}
    >
      <Section>
        <SectionIntro
          accent="accent-bordeaux"
          body={
            prismic.isFilled.richText(slice.primary.subtext) ? (
              <Reveal
                transition={{
                  duration: 0.72,
                  delay: 0.34,
                  ease: [0.22, 1, 0.36, 1],
                }}
                y={0}
              >
                {renderSectionSubtext(slice.primary.subtext)}
              </Reveal>
            ) : null
          }
          bodyPosition="start"
          className="lg:items-start"
          label={
            prismic.isFilled.keyText(slice.primary.label) ? (
              <Reveal
                className="inline-block"
                transition={{
                  duration: 0.64,
                  delay: 0.18,
                  ease: [0.22, 1, 0.36, 1],
                }}
                y={0}
              >
                {slice.primary.label}
              </Reveal>
            ) : null
          }
          title={
            prismic.isFilled.richText(slice.primary.title)
              ? renderSectionTitle(slice.primary.title)
              : null
          }
        />

        {prismic.isFilled.image(slice.primary.image) ? (
          <Reveal
            className="mt-10 sm:mt-14 lg:mt-16"
            delay={0.26}
            transition={{ duration: 0.92, ease: [0.22, 1, 0.36, 1] }}
            y={32}
          >
            <div className="relative overflow-hidden">
              <div className="relative min-h-[34rem] overflow-hidden sm:min-h-[38rem] lg:min-h-0 lg:aspect-[16/8] xl:aspect-[2.75/1]">
                <PrismicNextImage
                  field={slice.primary.image}
                  fill
                  imgixParams={{ fit: "crop" }}
                  className="object-cover object-top"
                />

                <div className="absolute inset-0 bg-night/28" />
                <div className="absolute inset-0 bg-gradient-to-r from-night/56 via-night/24 to-night/56" />
                <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-night/80 via-night/30 to-transparent" />

                <div className="relative z-10 flex min-h-[34rem] flex-col justify-end p-6 pt-60 sm:min-h-[38rem] sm:p-8 sm:pt-20 lg:absolute lg:inset-x-0 lg:bottom-0 lg:min-h-0 lg:p-10 lg:pt-12 xl:p-12">
                  <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-14">
                    <div className="max-w-sm text-rose-white">
                      {prismic.isFilled.richText(slice.primary.left_overlay_text) ? (
                        <Reveal
                          className="font-sans text-sm"
                          delay={0.38}
                          transition={{
                            duration: 0.72,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          y={18}
                        >
                          {renderSectionSubtext(slice.primary.left_overlay_text, {
                            tone: "dark",
                          })}
                        </Reveal>
                      ) : null}
                    </div>

                    <div className="max-w-sm lg:ml-auto">
                      {prismic.isFilled.richText(slice.primary.right_overlay_text) ? (
                        <Reveal
                          className="font-sans text-sm text-rose-white"
                          delay={0.46}
                          transition={{
                            duration: 0.72,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          y={18}
                        >
                          {renderSectionSubtext(slice.primary.right_overlay_text, {
                            tone: "dark",
                          })}
                        </Reveal>
                      ) : null}

                      {showSocialLinks && socialLinks.length ? (
                        <Reveal
                          delay={0.56}
                          transition={{
                            duration: 0.64,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          y={12}
                        >
                          <SocialLinks className="mt-5" links={socialLinks} tone="dark" />
                        </Reveal>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ) : null}
      </Section>
    </section>
  );
};

export default ProfileFeature;
