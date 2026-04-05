import { SliceZone } from "@prismicio/react";
import {
  SliceSimulator,
  getSlices,
  type SliceSimulatorParams,
} from "@prismicio/next";

import { components } from "@/slices";

export default async function SliceSimulatorPage({
  searchParams,
}: SliceSimulatorParams) {
  const params = await searchParams;
  const slices = getSlices(params.state);

  return (
    <SliceSimulator>
      <SliceZone components={components} slices={slices} />
    </SliceSimulator>
  );
}
