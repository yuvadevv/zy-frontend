import type { Meta, StoryObj } from "@storybook/react";
import { PasswordInput } from "./PasswordInput";

const meta: Meta<typeof PasswordInput> = {
  title: "Design System/inputs/PasswordInput",
  component: PasswordInput,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = { args: {} };
export const Disabled: Story = { args: { disabled: true } };