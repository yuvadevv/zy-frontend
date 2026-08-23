import type { Meta, StoryObj } from "@storybook/react";
import { OTPInput } from "./OTPInput";

const meta: Meta<typeof OTPInput> = {
  title: "Design System/inputs/OTPInput",
  component: OTPInput,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof OTPInput>;

export const Default: Story = { args: {} };
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { isDisabled: true } };