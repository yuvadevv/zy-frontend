import type { Meta, StoryObj } from "@storybook/react";
import { FloatingButton } from "./FloatingButton";

const meta: Meta<typeof FloatingButton> = {
  title: "Design System/buttons/FloatingButton",
  component: FloatingButton,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof FloatingButton>;

export const Default: Story = { args: {} };
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { isDisabled: true } };