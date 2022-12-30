import { createElement as vNode, useState } from "../../../vendor/react.js";
import MyViewPanel from "./MyViewPanel.js";
import { Collapse } from "../../../vendor/tdesign.min.js";
const { Panel: CollapsePanel } = Collapse;

import {
  formatter_All,
} from "../lib/my-vis-data-formatter.mjs.js";

const view_data_to_panel_items = (view_data) => {
  return formatter_All(view_data);
};

export default function MyViewPanelGroup(props) {

  console.log('MyViewPanelGroup(props):\n', props);

  return vNode(Collapse, {
    defaultExpandAll: true,
    expandOnRowClick: false,
  }, view_data_to_panel_items(props?.data).map((wrap, idx)=>vNode(CollapsePanel, {
    header: wrap.header,
    key: idx,
  }, wrap.items.map(it=>vNode('div', {
    key: it.key,
  }, vNode(MyViewPanel, {
    data: it.data,
    elementId: it.elementId,
  }))))));
};
