module.exports = {
    title: '并行文件系统',
    description: 'file system',
    themeConfig: {
        nav: [
          { text: '主页', link: '/' },
          { text: 'Lustre', link: '/lustre/' },
          { text: 'EOS', link: '/eos/' },
          { text: 'openZFS', link: '/openzfs/' },
        ],
        siderbar: {
            '/lustre/': [
                '',
                'intro'
            ],
            '/bar/': [
                '',
                'intro'
            ],
            '/lustre/': [
                '',
                'intro'
            ],
        }
      }
  }