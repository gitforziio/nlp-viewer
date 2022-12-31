import { createElement as vNode, Fragment, useState, useMemo } from "../../../../vendor/react.js";
// import ReactRouterDom from "../../../../vendor/react-router-dom.js";
import MyViewPanelGroup from "../../components/MyViewPanelGroup.js";
import {
  Layout,
  Menu,
  Row,
  Col,
  Button,
  Space,
  Upload,
  MessagePlugin,
} from "../../../../vendor/tdesign.min.js";

function getCurrentDate(needTime = false) {
  const d = new Date();
  let month = d.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  const date = `${d.getFullYear()}-${month}-${d.getDate()}`;
  const time = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  if (needTime) return [date, time].join(' ')
  return date;
};

export default function FileReaderDemo() {
  const [files, setFiles] = useState([]);
  const [autoUpload, setAutoUpload] = useState(true);
  const [multiple, setMultiple] = useState(false);
  const [theme, setTheme] = useState('file');  // file | file-flow

  const requestMethod = async (file_or_files) => {
    // 自定义加载方法。
    // 返回值 status 表示加载成功或失败，error 或 response.error 表示加载失败的原因，response 表示请求加载成功后的返回数据，response.url 表示加载成功后的图片地址。
    // 示例一：{ status: 'fail', error: '加载失败', response }。示例二：{ status: 'success', response: { url: 'https://tdesign.gtimg.com/site/avatar.jpg' } }。
    return new Promise((resolve, reject) => {
      try {
        if (file_or_files==null) {
          file_or_files=[];
        } else if (file_or_files!=null && !Array.isArray(file_or_files)) {
          file_or_files = [file_or_files];
        };
        if (file_or_files?.length > 1) {
          file_or_files = [file_or_files[0]];
        };
        const fileWrap = file_or_files[0];
        // console.log('fileWrap\n', fileWrap);
        // console.log('fileWrap\n', JSON.stringify(fileWrap, null, 2));

        const file = fileWrap?.raw;
        if (file==null) {throw "file is null."};
        const fileReader = new FileReader();

        fileReader.onload = (event) => {
          console.log('fileReader onload');
          // console.log(fileReader.result);
          resolve({
            status: 'success',
            event: event,
            response: {
              url: "https://tdesign.gtimg.com/site/avatar.jpg",
              textContent: fileReader.result,
            },
          });
        };

        fileReader.onerror = (event) => {
          console.log('fileReader onerror');
          reject({
            status: 'fail',
            error: '加载失败: fileReader onerror',
            event: event,
            response: {
              url: "https://tdesign.gtimg.com/site/avatar.jpg",
            },
          });
        };

        fileReader.onabort = (event) => {
          console.log('fileReader onabort');
          reject({
            status: 'fail',
            error: '加载失败: fileReader onabort',
            event: event,
            response: {
              url: "https://tdesign.gtimg.com/site/avatar.jpg",
            },
          });
        };

        fileReader.readAsText(file);

      } catch(err) {
        reject({
          status: 'fail',
          error: `加载失败: ${err}`,
          err: err,
          response: {
            url: "https://tdesign.gtimg.com/site/avatar.jpg",
          },
        });
      };
    });
  };

  const formatResponse = (res) => {
    // 响应结果添加加载时间字段，用于 UI 显示
    res.uploadTime = getCurrentDate();
    console.log('res\n', res);
    return res;
  };
  const onFail = (context) => {
    console.log('uploadFailContext\n', context);
    MessagePlugin.error('加载失败: 请管理员在控制台查看细节');
  };



  const [data_list, set_data_list] = useState([]);
  const [data_item, set_data_item] = useState({});
  const [data_idx_control__main_idx, set__data_idx_control__main_idx] = useState(0);
  const [data_idx_control__nlp_idx, set__data_idx_control__nlp_idx] = useState(0);
  const nlp_data = useMemo(()=>{
    return (data_item?.nlp_outputs??[])[data_idx_control__nlp_idx];
  }, [data_item?.nlp_outputs, data_idx_control__nlp_idx]);

  const set_content = (content) => {
    console.log(content);
    set_data_list(content);
    set_data_item(content?.[data_idx_control__main_idx??0]);
  };
  const go_previous_item = () => {
    const min_idx = 0;
    const main_idx = data_idx_control__main_idx??0;
    if (main_idx > min_idx) {
      set__data_idx_control__main_idx(main_idx-1);
      set_data_item(data_list?.[main_idx-1]);
      set__data_idx_control__nlp_idx(0);
    };
  };
  const go_next_item = () => {
    console.log("FLAG1");
    const max_idx = (data_list?.length??0)-1;
    const main_idx = data_idx_control__main_idx??0;
    if (main_idx < max_idx) {
      set__data_idx_control__main_idx(main_idx+1);
      set_data_item(data_list?.[main_idx+1]);
      set__data_idx_control__nlp_idx(0);
    };
    console.log("FLAG2");
  };
  const go_previous_nlp_idx = () => {
    const min_idx = 0;
    const nlp_idx = data_idx_control__nlp_idx??0;
    if (nlp_idx > min_idx) {
      set__data_idx_control__nlp_idx(nlp_idx-1);
    };
  };
  const go_next_nlp_idx = () => {
    const max_idx = (data_item?.nlp_outputs?.length??0)-1;
    const nlp_idx = data_idx_control__nlp_idx??0;
    if (nlp_idx < max_idx) {
      set__data_idx_control__nlp_idx(nlp_idx+1);
    };
  };

  const onSuccess = (context) => {
    // console.log('context\n', context);
    const textContent = context?.response?.textContent;
    if (!textContent?.length) {
      MessagePlugin.error('加载失败: 没有文本内容');
      return;
    };
    let jsonContent;
    try {
      jsonContent = JSON.parse(textContent);
      if (!Array.isArray(jsonContent)) {jsonContent = [jsonContent]};
      set_content(jsonContent);
      MessagePlugin.success('加载成功 (json)');
      return;
    } catch (json_error) {
      try {
        jsonContent = textContent.split("\n").filter(it=>it.length).map(it=>JSON.parse(it));
        set_content(jsonContent);
        MessagePlugin.success('加载成功 (jsonlines)');
        return;
      } catch (jsonlines_error) {
        MessagePlugin.error('加载失败: 无法解析的 json 或 jsonlines 内容');
        return;
      };
    };
  };

  return vNode('div', null, [
    vNode('div', {className: "my-2"}, [
      vNode(Upload, {
        theme: theme,
        autoUpload: autoUpload,
        multiple: multiple,
        data: { extraData: 123, fileName: 'certificate' },
        draggable: true,
        action: null,
        requestMethod: requestMethod,
        files: files,
        formatResponse: formatResponse,
        onChange: setFiles,
        onFail: onFail,
        onSuccess: onSuccess,
      }),
    ]),
    vNode('div', {className: "my-2"}, [
      vNode('div', {className: "my-1 hstack gap-1"}, [
      ]),
      vNode('div', {className: "my-1 hstack gap-1"}, [
        vNode(Button, { theme: "default", size: "small", onClick: ()=>{go_previous_item()}, }, "上一个动作"),
        vNode(Button, { theme: "default", size: "small", onClick: ()=>{go_next_item()}, }, "下一个动作"),
        vNode('span', {}, `${data_item?.head??"<未知动作>"}`),
      ]),
      vNode('div', {className: "my-1 hstack gap-1 flex-wrap"}, (data_item?.nlp_outputs??[]).map((nlp_item, idx)=>vNode('button', {
        type: "button",
        className: [
          "btn btn-sm",
          idx==data_idx_control__nlp_idx?"btn-primary":"btn-light"
        ].join(" "),
        onClick: ()=>{set__data_idx_control__nlp_idx(idx);},
      }, nlp_item?.text??"<无内容>"))),
      vNode('div', {className: "my-1 hstack gap-1"}, [
        vNode(Button, { theme: "default", size: "small", onClick: ()=>{go_previous_nlp_idx()}, }, "上一个片段"),
        vNode(Button, { theme: "default", size: "small", onClick: ()=>{go_next_nlp_idx()}, }, "下一个片段"),
        // vNode('span', {}, `${nlp_data?.text??"<未知内容>"}`),
      ]),
    ]),
    nlp_data==null ? null :
    vNode(MyViewPanelGroup, {
      data: nlp_data,
      key: nlp_data?.text,
    }),
    // vNode('div', {className: "my-2"}, [`${JSON.stringify(nlp_data)}`]),
    // vNode('div', {className: "my-2"}, [`${JSON.stringify(data_list)}`]),
  ]);
};
