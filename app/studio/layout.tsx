/**
 * The Studio sits outside the (site) route group, so it gets no header,
 * footer or page chrome, just a full-height container for the editor.
 */
export default function StudioLayout({ children }: LayoutProps<"/studio">) {
  return <div className="h-dvh">{children}</div>;
}
