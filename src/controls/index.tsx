import * as React from "react";
import * as ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import { MemoryRouter, Route } from "react-router-dom";

import { PanelType } from "./PanelType";

//import { initializeIcons } from "@fluentui/react/lib/Icons";

// import { PanelType } from "./PanelType";
import SampleGallery from "./sampleGallery/SampleGallery";
import DefaultPage from "./defaultPage/DefaultPage";
import DemoGuides from "./demoGuides/DemoGuides";
// import AccountHelp from "./webviewDocs/accountHelp";
// import FunctionBasedNotificationBot from "./webviewDocs/functionBasedNotificationBot";
// import ExpressServerNotificationBot from "./webviewDocs/expressServerNotificationBot";
// import WorkflowBot from "./webviewDocs/workflowBot";

const language = "en";

ReactDOM.render(
  <IntlProvider locale={language}>
    <App />
  </IntlProvider>,
  document.getElementById("root") as HTMLElement
);

function App(props: any) {
  // Initializing the office-ui-fabric-icons here to avoid multiple initializations in every component.
  //initializeIcons();

  let initialIndex = 0;
  if (panelType === PanelType.SampleGallery) {
    initialIndex = 1;
  } else if (panelType === PanelType.DemoGuides) {
    initialIndex = 2;
  }

  return (
    <MemoryRouter
      initialEntries={[
        "/the-f5-extension",
        "/f5-sample-gallery",
        "/f5-demo-guides",
      ]}
      initialIndex={initialIndex}
    >
      <Route
        path="/the-f5-extension"
        render={() => (
          <DefaultPage />
        )}
      />
      <Route path="/f5-sample-gallery" component={SampleGallery} />
      <Route path="/f5-demo-guides" component={DemoGuides} />
    </MemoryRouter>
  );
}