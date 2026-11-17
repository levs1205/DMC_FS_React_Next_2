export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-full flex flex-col red">
        {children}
    </div>
  );
}