import { Pane } from "tweakpane";

let pane: Pane | undefined;
let folderCount = 0;

/** Share one panel between features; call after mounting in development only. */
export const createPaneFolder = (title: string, onReset: () => void) => {
  pane ??= new Pane({ title: "Parameters" });
  const folder = pane.addFolder({ title, expanded: false });
  folder.addButton({ title: "初期値に戻す" }).on("click", () => {
    onReset();
    folder.refresh();
  });
  folderCount++;
  let disposed = false;

  return {
    folder,
    dispose: () => {
      if (disposed) return;
      disposed = true;
      folder.dispose();
      folderCount--;
      if (folderCount === 0) {
        pane?.dispose();
        pane = undefined;
      }
    },
  };
};
