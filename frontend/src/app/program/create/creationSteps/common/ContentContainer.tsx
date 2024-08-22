export const ContentContainer = ({
  contentHeader,
  children,
}: {
  contentHeader: string;
  children: React.ReactElement;
}): React.ReactElement => {
  return (
    <div key={contentHeader} className="contentContainer relative w-full flex flex-col animate-fadeIn">
      <div className="containerHeader text-2xl text-neutral-500 mb-4">{contentHeader}</div>
      <div className="containerBody px-1 flex flex-col">{children}</div>
    </div>
  );
};
