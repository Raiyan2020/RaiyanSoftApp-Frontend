type SectionHeaderProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Optional action (e.g. a "view all" link), centered under the description. */
  children?: React.ReactNode;
};

// Shared centered header for every home-page section: title, then the
// description centered under it at a readable width, then any action.
export default function SectionHeader({ title, description, children }: SectionHeaderProps) {
  return (
    <div className="reveal mx-auto mb-10 max-w-3xl text-center lg:mb-12">
      <h2 className="text-2xl font-bold leading-[1.34] text-slate-950 dark:text-white sm:text-3xl lg:text-[2.35rem]">
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}
