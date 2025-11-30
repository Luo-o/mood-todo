export const MOOD = {
  HAPPY: 'happy',
  SAD: 'sad',
  NORMAL: 'normal',
}

export function moodLabel(value) {
  switch (value) {
    case MOOD.HAPPY:
      return '😊 开心'
    case MOOD.SAD:
      return '😢 不太好'
    case MOOD.NORMAL:
      return '😐 一般'
    default:
      return '未选择'
  }
}