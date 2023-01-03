import Lodash from "../../../vendor/lodash.mjs.js";

export function formatter_AMR_HanLP(it) {
  const that = {
    input: it.input,
    spans: [],
    nodes: [],
    edges: it.edges,
    tops: it.tops,
  };
  for (const node of it.nodes) {
    const deno = {
      idx: node.id,
      label: node.label,
      anchors: [],
    };
    for (const frag of node.anchors) {
      const span = {
        idx: that.spans.length,
        range: [frag.from, frag.to],
      };
      that.spans.push(span);
      deno.anchors.push(span.idx);
    };
    that.nodes.push(deno);
  };
  return that;
};

export function formatter_Con_HanLP(it) {
  const process_tree = (tree, node_list=[], arc_list=[], spans=[], text_wrap={text:""}, parent={})=>{
    const label_or_text = tree[0];
    const children = tree?.[1]??[];

    const type = children?.length ? "label" : "text";

    const this_node = {
      idx: null,
    };
    this_node[type] = label_or_text;
    if (type!="text") {
      this_node.idx = node_list.length;
      node_list.push(this_node);
    } else {
      this_node.type = type;
      this_node.span = {
        idx: spans.length,
        range: [text_wrap.text.length, text_wrap.text.length+label_or_text.length],
        text: label_or_text,
      };
      spans.push(this_node.span);
      text_wrap.text = `${text_wrap.text}${label_or_text}`;
    };

    if (children?.length) {
      children.forEach((child,ii)=>{
        const dog = process_tree(child, node_list, arc_list, spans, text_wrap, this_node);
        if (dog?.self?.type=="text") {
          this_node.text = dog.self.text;
          this_node.anchors = [dog.self.span.idx];
        } else {
          arc_list.push({
            source: this_node.idx,
            target: dog.self.idx,
          });
        };
      });
    };
    return {
      self: this_node,
      nodes: node_list,
      arcs: arc_list,
      spans,
      text: text_wrap.text,
    };
  };
  const baba = process_tree(it);
  baba.self.is_root=true;
  const that = {nodes: baba.nodes, arcs: baba.arcs, spans: baba.spans, text: baba.text};
  return that;
};

export function formatter_Con_Stanza(it) {
  const process_tree = (tree, node_list=[], arc_list=[], spans=[], text_wrap={text:""}, parent={})=>{

    if (typeof(tree)==="string") {
      tree = [tree];
    };

    const label_or_text = tree[0];
    const children = tree?.[1]??[];

    const type = children?.length ? "label" : "text";

    const this_node = {
      idx: null,
    };
    this_node[type] = label_or_text;
    if (type!="text") {
      this_node.idx = node_list.length;
      node_list.push(this_node);
    } else {
      this_node.type = type;
      this_node.span = {
        idx: spans.length,
        range: [text_wrap.text.length, text_wrap.text.length+label_or_text.length],
        text: label_or_text,
      };
      spans.push(this_node.span);
      text_wrap.text = `${text_wrap.text}${label_or_text}`;
    };

    if (children?.length) {
      children.forEach((child,ii)=>{
        const dog = process_tree(child, node_list, arc_list, spans, text_wrap, this_node);
        if (dog?.self?.type=="text") {
          this_node.text = dog.self.text;
          this_node.anchors = [dog.self.span.idx];
        } else {
          arc_list.push({
            source: this_node.idx,
            target: dog.self.idx,
          });
        };
      });
    };

    return {
      self: this_node,
      nodes: node_list,
      arcs: arc_list,
      spans,
      text: text_wrap.text,
    };
  };
  const baba = process_tree(it);
  baba.self.is_root=true;
  const that = {nodes: baba.nodes, arcs: baba.arcs, spans: baba.spans, text: baba.text};
  return that;
};

function __make_new_list(list) {
  const new_list = list.map(it=>{
    const spans = [];
    let last_slot = 0;
    for (let ii in it) {
      const new_slot = last_slot+it[ii][0].length;
      spans.push({
        id: ii,
        range: [last_slot, new_slot],
        text: it[ii][0],
        label: it[ii][3],
        anchors: [ii],
        is_root: it[ii][1]==0?true:undefined,
        source: it[ii][1]-1>=0?it[ii][1]-1:undefined,
        target: ii,
        edge: it[ii][2],
      });
      last_slot = new_slot;
    };
    const dict = {
      tokens: spans,
    };
    return dict;
  });
  return new_list;
};

export function formatter_Dep_HanLP(item, idx, wrap, standard="UD") {
  const nlp = wrap.by_hanlp;
  const list = [];
  for (const sentence_idx in nlp.tok) {
    const cws = nlp.tok[sentence_idx];
    // const poses = nlp.pos[sentence_idx];
    const heads = nlp[`dep/${standard}`][sentence_idx].map(it=>it[0]);
    const labels = nlp[`dep/${standard}`][sentence_idx].map(it=>it[1]);
    list.push(Lodash.zip(cws, heads, labels));
  };
  // console.log(list);
  const new_list = __make_new_list(list);
  // console.log(new_list[idx]);
  return new_list[idx];
};

export function formatter_Dep_LTP(item, idx, wrap, label="dep") {
  const nlp = wrap.by_ltp;
  const list = [];
  for (const sentence_idx in nlp.cws) {
    const cws = nlp.cws[sentence_idx];
    const poses = nlp.pos[sentence_idx];
    const heads = nlp[label][sentence_idx].head;
    const labels = nlp[label][sentence_idx].label;
    list.push(Lodash.zip(cws, heads, labels, poses));
  };
  // console.log(list);
  const new_list = __make_new_list(list);
  // console.log(new_list[idx]);
  return new_list[idx];
};

export function formatter_Dep_FastHan(item, idx, wrap) {
  const nlp = wrap.by_fasthan;
  const list = nlp.parse;
  // console.log(list);
  const new_list = __make_new_list(list);
  // console.log(new_list[idx]);
  return new_list[idx];
};


const ref_info_dict = {
  'amr': {
    link: "https://github.com/amrisi/amr-guidelines/blob/master/amr.md",
  },
  'hanlp-con': {
    link: "https://hanlp.hankcs.com/docs/annotations/constituency/index.html",
  },
  'stanza-con': {
    link: "https://stanfordnlp.github.io/stanza/constituency.html",
  },
  'hanlp-dep-pmt': {
    link: "https://hanlp.hankcs.com/docs/annotations/dep/pmt.html",
  },
  'hanlp-dep-sd': {
    link: "https://hanlp.hankcs.com/docs/annotations/dep/index.html",
  },
  'hanlp-dep-ud': {
    link: "https://hanlp.hankcs.com/docs/annotations/dep/ud.html",
  },
  'fasthan-dep': {
    link: "https://github.com/fastnlp/fastHan/blob/master/README.md?plain=1#L167",
  },
  'ltp-dep': {
    link: "http://ltp.ai/docs/appendix.html#id5",
  },
  'ltp-sdp': {
    link: "http://ltp.ai/docs/appendix.html#id6",
  },
};


export function formatter_All(view_data) {
  const list_ = [];

  const step = (data, byWho, tag, list, header, formatter_fn, ref_info) => {
    if (data?.[byWho]?.[tag] != null) {
      list.push({
        header: header,
        items: data[byWho][tag].map((detail_item, detail_idx)=>({
          key: `diagram-${byWho}-${tag.split("/").join("-")}-${detail_idx}`,
          data: formatter_fn(detail_item, detail_idx, data),
          sourceData: detail_item,
          elementId: `diagram-${byWho}-${tag.split("/").join("-")}-${detail_idx}`,
        })),
        ref_info: ref_info ?? null,
      });
    };
  };

  step(view_data, 'by_hanlp', 'amr', list_, 'AMR by HanLP', formatter_AMR_HanLP, ref_info_dict['amr']);

  step(view_data, 'by_hanlp', 'con/full', list_, 'Con.(CTB full) by HanLP', formatter_Con_HanLP, ref_info_dict['hanlp-con']);
  step(view_data, 'by_hanlp', 'con/major', list_, 'Con.(CTB major) by HanLP', formatter_Con_HanLP, ref_info_dict['hanlp-con']);
  step(view_data, 'by_stanza', 'con', list_, 'Con. by Stanza', formatter_Con_Stanza, ref_info_dict['stanza-con']);

  step(view_data, 'by_hanlp', 'dep/PMT', list_, 'Dep.(PMT) by HanLP', (it, idx, da)=>formatter_Dep_HanLP(it, idx, da, "PMT"), ref_info_dict['hanlp-dep-pmt']);
  step(view_data, 'by_hanlp', 'dep/SD', list_, 'Dep.(SD) by HanLP', (it, idx, da)=>formatter_Dep_HanLP(it, idx, da, "SD"), ref_info_dict['hanlp-dep-sd']);
  step(view_data, 'by_hanlp', 'dep/UD', list_, 'Dep.(UD) by HanLP', (it, idx, da)=>formatter_Dep_HanLP(it, idx, da, "UD"), ref_info_dict['hanlp-dep-ud']);
  step(view_data, 'by_fasthan', 'parse', list_, 'Dep.(CTB9) by FastHan', formatter_Dep_FastHan, ref_info_dict['fasthan-dep']);
  step(view_data, 'by_ltp', 'dep', list_, 'Dep. by LTP', (it, idx, da)=>formatter_Dep_LTP(it, idx, da, "dep"), ref_info_dict['ltp-dep']);
  step(view_data, 'by_ltp', 'sdp', list_, 's.d.p. by LTP', (it, idx, da)=>formatter_Dep_LTP(it, idx, da, "sdp"), ref_info_dict['ltp-sdp']);

  return list_;
};
