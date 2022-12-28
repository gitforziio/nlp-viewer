import { createElement as vNode, Fragment } from "../../../../vendor/react.js";
import ReactRouterDom from "../../../../vendor/react-router-dom.js";

export default function PageNotFound() {
  return vNode(Fragment, null, [
    vNode('p', null, '开发中'),
  ]);
}