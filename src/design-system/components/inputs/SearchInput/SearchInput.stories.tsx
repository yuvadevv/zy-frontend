import type { Meta, StoryObj } from "@storybook/react";
import { SearchInput } from "./SearchInput";

const meta: Meta<typeof SearchInput> = {
  title: "Design System/inputs/SearchInput",
  component: SearchInput,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof SearchInput>;

export const Default: Story = { args: {} };
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { isDisabled: true } };