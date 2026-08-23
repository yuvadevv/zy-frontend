import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Design System/inputs/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = { args: {} };
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { isDisabled: true } };