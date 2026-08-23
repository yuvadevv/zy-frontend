import type { Meta, StoryObj } from "@storybook/react";
import { PhoneInput } from "./PhoneInput";

const meta: Meta<typeof PhoneInput> = {
  title: "Design System/inputs/PhoneInput",
  component: PhoneInput,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof PhoneInput>;

export const Default: Story = { args: {} };
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { isDisabled: true } };