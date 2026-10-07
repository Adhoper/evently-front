import {
  Toaster,
} from "sonner";

import {
  useTheme,
} from "../../hooks/useTheme";

function AppToaster() {
  const {
    theme,
  } = useTheme();

  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme={theme}
    />
  );
}

export default AppToaster;