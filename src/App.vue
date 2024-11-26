<script setup lang="ts">
  import { inject } from 'vue';
  const axios = inject('axios');
  const haituUrl = 'http://localhost:3002'
  //发送消息到海图
  const dataDisplay: any = () => {
    const iframe = document.getElementById('myIframe') as HTMLIFrameElement
      const message = {
        type: 'dataDisplay'
      }
      iframe.contentWindow?.postMessage(message, haituUrl);
  }
  
  // 监听海图消息
  window.addEventListener("message", async event => {
    if (event.origin !== haituUrl||event.data==undefined||typeof event.data != 'string') { return } // 验证来源
    const data = JSON.parse(event.data)
    console.log("前端接收到数据：",data)
    if (data.type === "coor") {
      const res = await getData(data.data)
      console.log("后端返回数据: ", res)
      window.parent.postMessage(res, haituUrl)
    }
  })

//发送消息到后端
type Coordinate = number[][];
async function getData(coordinate: Coordinate) {
    // 将坐标转换为字符串形式，以便于通过URL传递
    const coordinateStr = JSON.stringify(coordinate);
    // 使用axios发送GET请求
     try {
        const response = await axios.get(`data/test?coordinates=${encodeURIComponent(coordinateStr)}`);
        return response.data; // 返回从服务器获取的数据
    } catch (error) {
        console.error('Error in the request:', error);
        throw error; // 重新抛出错误以便在调用者处处理
    }
  }
</script>


<template>
  <div class="container">
    <div class="iframe-container">
      <iframe id="myIframe" src="http://localhost:3002/" style="width: 100%; height: 100%; border: none;"></iframe>
    </div>
    <button @click="dataDisplay">测试</button>
  </div>
</template>


<style>
/* 重置默认的 margin 和 padding */
body, html {
  margin: 0;
  padding: 0;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
}

.iframe-container {
  border-width: 3px;
  border-color: black;
  border-style: solid;
  width: 2400px;
  height: 920px;
  margin: 0;
  padding: 0;
}

button {
  margin-top: 20px;
}
</style>
