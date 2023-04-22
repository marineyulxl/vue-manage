<!--
 * @Author: marineyulxl
 * @Date: 2023-04-21 22:14:18
 * @LastEditTime: 2023-04-22 16:18:14
-->
<template>
  <div class="outer">
    <el-row>
      <el-col :span="12">
        <video class='video' :src="videoURL" controls></video>
      </el-col>
      <el-col :span="12">
        <div class='head_title'>
          视频展示区
        </div>
        <div class="center">
          <div class="time">创建时间：{{ videoInfo.createdAt }}</div>
          <div class="time">更新时间：{{ videoInfo.updatedAt }}</div>
        </div>
        <div class="upload">
          <el-upload ref="uploadRef" class="upload-demo" :auto-upload="false" :http-request="upload" :limit="1"
            :on-change="handleChangePic" :on-success="handleSuccess">
            <template #trigger>
              <el-button type="primary" style="margin-right: 20px;">选择视频</el-button>
            </template>

            <el-button class="ml-3" type="success" @click="submitUpload">
              上传视频
            </el-button>
            <template #tip>
              <div class="el-upload__tip text-red">
                只能上传一个视频
              </div>
            </template>
          </el-upload>
        </div>
      </el-col>
    </el-row>
  </div>
</template>


<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { getVideo, updateVideo } from '../api/video'
import { baseURL } from '../utils/baseUrl'
import { ElMessage, ElMessageBox, ElTable } from 'element-plus';
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'

interface VideoInfo {
  _id: string;
  createdAt: string;
  updatedAt: string;
  videoUrl: string;
}

const videoURL = ref<string>('');
const videoInfo = reactive<VideoInfo>({
  _id: '',
  createdAt: '',
  updatedAt: '',
  videoUrl: ''
});

const GetVideo = async (): Promise<void> => {
  try {
    const { data: res } = await getVideo();
    res.data.videoUrl = baseURL + res.data.videoUrl;
    videoURL.value = res.data.videoUrl;
    ElMessage.success(res.message);
    const date = new Date(res.data.createdAt);
    res.data.createdAt = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const date2 = new Date(res.data.updatedAt);
    res.data.updatedAt = `${date2.getFullYear()}/${date2.getMonth() + 1}/${date2.getDate()} ${date2.getHours()}:${date2.getMinutes()}:${date2.getSeconds()}`;

    videoInfo._id = res.data._id;
    videoInfo.createdAt = res.data.createdAt;
    videoInfo.updatedAt = res.data.updatedAt;
    videoInfo.videoUrl = res.data.videoUrl;
    console.log(22222, videoInfo.videoUrl);

  } catch (error: any) {
    ElMessage.error(error.response.data.message);
  }
};

GetVideo();


const upload = async (params: any) => {
  let formData = new FormData()
  formData.append('videoUrl', params.file)
  try {
    const { data: res } = await updateVideo(formData)
    console.log(res);
    GetVideo()
  } catch (error) {

  }

}
const uploadRef = ref<UploadInstance>()

function handleChangePic(file: any, fileList: any) {
  if (fileList.length > 1) {
    fileList.splice(0, 1);
  }
}

const handleSuccess = (file: any, fileList: any) => {
  console.log(fileList);
  uploadRef.value!.clearFiles() // 清空 fileList
}
const submitUpload = () => {
  uploadRef.value!.submit()
}

</script>

<style scoped>
.outer{
  min-width: 1250px;
}
video {
  height: 300px;
  width: 500px;
}

.head_title {
  font-size: 20px;
  color: #383838;
}

.center {
  margin-top: 20px;
}

.upload {
  margin-top: 20px;
}
.text-red{
  color: #F56C6C;
}
</style>