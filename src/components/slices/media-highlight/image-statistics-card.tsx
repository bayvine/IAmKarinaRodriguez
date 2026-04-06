import * as prismic from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";

import { cn } from "@/lib/utils";

type StatisticItem = {
  stat_value: prismic.KeyTextField;
  stat_text: prismic.KeyTextField;
};

type ImageStatisticsCardProps = {
  image: prismic.ImageField;
  statistics: StatisticItem[];
};

export function ImageStatisticsCard({
  image,
  statistics,
}: ImageStatisticsCardProps) {
  if (!prismic.isFilled.image(image)) {
    return null;
  }

  const filledStatistics = statistics.filter(
    (item) =>
      prismic.isFilled.keyText(item.stat_value) ||
      prismic.isFilled.keyText(item.stat_text),
  );

  return (
    <div className="relative aspect-[16/11.75] overflow-hidden bg-night shadow-[0_42px_120px_-70px_rgba(26,24,24,0.45)] sm:aspect-[16/8] lg:aspect-[16/6]">
      <PrismicNextImage
        field={image}
        fill
        imgixParams={{ fit: "crop" }}
        className="object-cover object-top"
      />

      <div className="absolute inset-0 bg-linear-to-b from-night/6 via-night/14 to-night/26" />
      <div
        className={
          filledStatistics.length > 0
            ? "absolute inset-x-0 bottom-0 h-[62%] bg-linear-to-t from-night via-night/80 to-transparent"
            : "absolute inset-x-0 bottom-0 h-[42%] bg-linear-to-t from-night/80 via-night/50 to-transparent"
        }
      />

      {filledStatistics.length > 0 ? (
        <div className="absolute inset-x-0 bottom-0 flex justify-center px-5 pb-5 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10">
          <div className="flex w-full max-w-5xl flex-wrap justify-center lg:justify-between gap-x-8 gap-y-5 sm:gap-x-12 sm:gap-y-6 lg:gap-x-16">
            {filledStatistics.map((item, index) => (
              <div
                key={`${item.stat_value}-${item.stat_text}-${index}`}
                className={cn(
                  "flex min-w-[8.5rem] flex-col items-center text-center sm:min-w-[11rem]",
                )}
              >
                {prismic.isFilled.keyText(item.stat_value) ? (
                  <p
                    className="font-display text-4xl text-rose-white sm:text-5xl lg:text-6xl"
                    style={{ lineHeight: 0.9 }}
                  >
                    {item.stat_value}
                  </p>
                ) : null}
                {prismic.isFilled.keyText(item.stat_text) ? (
                  <p
                    className="mt-1 max-w-[9rem] font-display text-base text-rose-white sm:mt-1.5 sm:max-w-[12rem] sm:text-lg lg:text-xl"
                    style={{ lineHeight: 0.96 }}
                  >
                    {item.stat_text}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
