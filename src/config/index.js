/**
 * 环境配置文件
 * 一般有三个环境：开发环境、测试环境、线上环境
 */
const env = import.meta.env.MODE || 'prod'

const EnvConfig = {
  development: {
    baseApi: '/api',
    mockApi:
      'https://www.fastmock.site/mock/63f4e776c29bd14b8f21203e377ceee9/api',
  },
  test: {
    baseApi: '//abc.com/api',
    mockApi:
      'https://www.fastmock.site/mock/63f4e776c29bd14b8f21203e377ceee9/api',
  },
  prod: {
    baseApi: '//def.com/api',
    mockApi:
      'https://www.fastmock.site/mock/63f4e776c29bd14b8f21203e377ceee9/api',
  },
}

export default {
  env,
  mock: true,
  ...EnvConfig[env],
}
