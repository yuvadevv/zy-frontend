import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./Spinner";

const meta: Meta<typeof Spinner> = {
  title: "Design System/loaders/Spinner",
  component: Spinner,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = { args: {} };
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { isDisabled: true } };