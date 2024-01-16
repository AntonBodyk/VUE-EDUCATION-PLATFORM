<template>
  <div class="account-container">
    <h1 class="account-title">Мой аккаунт</h1>

    <a-form
        :model="userProfile"
        name="userProfileForm"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        style="width: 600px; margin: 50px auto;"
        @submit.prevent="updateUserProfile"
    >
      <a-form-item label="Фото">
        <a-upload
            :before-upload="beforeUpload"
            :show-upload-list="false"
        >
          <a-avatar :src="userProfile.avatar" size="large" class="avatar" />
        </a-upload>
      </a-form-item>

      <a-form-item label="ФИО" name="name">
        <a-input v-model:value="userProfile.name" />
      </a-form-item>

      <a-form-item label="Статус" name="role">
        <a-select v-model:value="userProfile.role" :disabled="editingRole">
          <a-select-option value="teacher">Учитель</a-select-option>
          <a-select-option value="student">Ученик</a-select-option>
        </a-select>
        <a-tooltip v-if="editingRole" title="Сохранить изменения">
          <a v-on:click="saveRoleChanges">
            <a-icon type="check-circle" theme="filled" class="success-icon" />
          </a>
        </a-tooltip>
        <a-tooltip v-else title="Редактировать статус">
          <a v-on:click="enableRoleEditing">
            <a-icon type="edit" class="edit-icon" />
          </a>
        </a-tooltip>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">Сохранить изменения</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>


export default {
  data() {
    return {
      userProfile: {
        avatar: '',
        name: '',
        role: '',
      },
      editingRole: false,
    };
  },
  methods: {
    async updateUserProfile() {
      // Логика для отправки обновленных данных на сервер
      console.log('Обновление профиля:', this.userProfile);
    },
    beforeUpload(file) {
      // Логика для обработки загрузки фото
      console.log('Загрузка фото:', file);
      this.userProfile.avatar = URL.createObjectURL(file);
      return false; // Отмена автоматической загрузки файла
    },
    enableRoleEditing() {
      this.editingRole = true;
    },
    saveRoleChanges() {
      this.editingRole = false;
    },
  },
};
</script>

<style scoped>
.account-container {
  text-align: center;
}

.account-title {
  font-size: 28px;
  margin-bottom: 20px;
  color: #1890ff; /* синий цвет */
}

.avatar {
  border: 2px solid #1890ff; /* синий цвет */
}

.success-icon {
  color: #52c41a; /* зеленый цвет */
  font-size: 16px;
  cursor: pointer;
}

.edit-icon {
  color: #1890ff; /* синий цвет */
  font-size: 16px;
  cursor: pointer;
}
</style>