// Small hand-drawn icon set (24×24, stroke-based) so we don't depend on an icon library.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const MapIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z" />
    <path d="M9 4v14M15 6v14" />
  </Icon>
);

export const HeartPinIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11Z" />
    <path d="M12 13.2s-2.6-1.6-2.6-3.3a1.4 1.4 0 0 1 2.6-.8 1.4 1.4 0 0 1 2.6.8c0 1.7-2.6 3.3-2.6 3.3Z" fill="currentColor" stroke="none" />
  </Icon>
);

export const FriendsIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
    <circle cx="16.5" cy="9" r="2.6" />
    <path d="M16 14.6c2.3 0 4 1.5 4.5 4.4" />
  </Icon>
);

export const ProfileIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="8.5" r="3.8" />
    <path d="M4.5 20.5c.9-3.9 3.8-6 7.5-6s6.6 2.1 7.5 6" />
  </Icon>
);

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </Icon>
);

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);

export const LocateIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20.5 3.5 3.5 10.6l7.2 2.7 2.7 7.2 7.1-17Z" />
  </Icon>
);

export const StarIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={0} fill="currentColor">
    <path d="m12 3.2 2.6 5.5 6 .7-4.4 4.1 1.2 5.9L12 16.5l-5.4 2.9 1.2-5.9-4.4-4.1 6-.7L12 3.2Z" />
  </Icon>
);

export const PinIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 21s-6.5-5.4-6.5-11a6.5 6.5 0 0 1 13 0c0 5.6-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </Icon>
);

export const ClockIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m9 6 6 6-6 6" />
  </Icon>
);

export const DirectionsIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 2.8 21.2 12 12 21.2 2.8 12 12 2.8Z" />
    <path d="M9.5 14.5v-2a1.5 1.5 0 0 1 1.5-1.5h4M13 8.5l2.5 2.5-2.5 2.5" />
  </Icon>
);

export const BookmarkIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6.5 3.5h11v17L12 16.5l-5.5 4v-17Z" />
  </Icon>
);

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
);

export const PencilIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M15.5 4.5 19.5 8.5 8.5 19.5H4.5v-4l11-11Z" />
  </Icon>
);

export const TrashIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" />
  </Icon>
);

export const SparkleIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.5c.6 4.2 2.3 5.9 6.5 6.5-4.2.6-5.9 2.3-6.5 6.5-.6-4.2-2.3-5.9-6.5-6.5 4.2-.6 5.9-2.3 6.5-6.5Z" />
    <path d="M18.5 16.5c.2 1.4.8 2 2.2 2.2-1.4.2-2 .8-2.2 2.2-.2-1.4-.8-2-2.2-2.2 1.4-.2 2-.8 2.2-2.2Z" />
  </Icon>
);

/** The RdThrd logo mark: a pin with a trailing thread. */
export const LogoMark = (p: IconProps) => (
  <svg viewBox="0 0 32 32" aria-hidden="true" {...p}>
    <rect width="32" height="32" rx="9" fill="#D9482E" />
    <g fill="none" stroke="#FBF5EC" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 22.6c-2.6-3.1-5.6-5.7-5.6-9.6a5.6 5.6 0 0 1 11.2 0c0 3.9-3 6.5-5.6 9.6Z" />
      <path d="M16 22.6c-.6 2.2 1.1 3.5 3.1 2.9 2-.6 2.9.4 3.4 1.6" />
    </g>
    <circle cx="16" cy="13" r="1.9" fill="#FBF5EC" />
  </svg>
);
