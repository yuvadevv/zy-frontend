import type { Meta, StoryObj } from "@storybook/react";
import { TextInput } from "./TextInput";

const meta: Meta<typeof TextInput> = {
  title: "Design System/inputs/TextInput",
  component: TextInput,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof TextInput>;

export const Default: Story = { args: {} };
export const Disabled: Story = { args: { disabled: true } };