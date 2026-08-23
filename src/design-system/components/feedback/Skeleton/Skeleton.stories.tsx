import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Design System/feedback/Skeleton",
  component: Skeleton,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = { args: {} };
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { isDisabled: true } };