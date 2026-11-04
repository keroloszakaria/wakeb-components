import { computed } from "vue";
import type { UserBadgeProps } from "../types";

/** Defaults shared by every WUserBadge renderer; providers must not change them. */
export const userBadgeDefaults = {
  user: () => ({}),
  type: "outline",
  borderRadius: "md",
  icon: "",
  iconSize: "xs",
  iconPosition: "before",
  avatarSize: 16,
  avatarColor: "primary",
} as const;

/** Text color of the initials avatar; the background comes from `avatarColor`. */
export const AVATAR_TEXT = "var(--wakeb-avatar-text, var(--wakeb-ui-on-primary, #fff))";

/** HTTP-prefixed, root-relative and data URLs are images; anything else falls back to initials. */
export const avatarSource = (value: unknown) =>
  typeof value === "string" && (value.startsWith("http") || value.startsWith("/") || value.startsWith("data:")) ? value : "";

/** Baseline initials: `?` for a missing name or an em dash, first UTF-16 unit of the first two words. */
export function userInitials(name: string | undefined) {
  if (!name || name === "—") return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return `${parts[0]?.charAt(0) || ""}${parts[1]?.charAt(0) || ""}`.toUpperCase();
}

/** Provider-neutral WUserBadge behavior: avatar source and initials. */
export function useUserBadge(props: Required<Pick<UserBadgeProps, "user">>) {
  const avatar = computed(() => avatarSource(props.user.avatar));
  const initials = computed(() => userInitials(props.user.name));
  return { avatar, initials };
}
