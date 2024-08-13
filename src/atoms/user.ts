import { atom } from 'recoil';
import { Editor } from 'tinymce';

export const loginState = atom({
  key: 'loginState',
  default: {
    isLoggedIn: false,
    accessToken: '',
    refreshToken: '',
  },
});

export const tinymceEditorState = atom<Editor | null>({
  key: 'tinymceEditor',
  default: null,
  dangerouslyAllowMutability: true,
});