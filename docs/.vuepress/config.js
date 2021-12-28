module.exports = {
    title: '并行文件系统',
    description: 'file system',
    themeConfig: {
        nav: [
          { text: '主页', link: '/' },
          { text: 'Lustre', link: '/lustre/' },
          { text: 'EOS', link: '/eos/' },
          { text: 'openZFS', link: '/openzfs/' },
          { text: 'linux优化', link: '/operation/' },
        ],
        sidebar: {
            '/lustre/': [
                {
                    title: "快速上手",
                    icon: "creative",
                    // prefix: "get-started/",
                    collapsable: true,
                    children: ["","intro", "one", "two"],
                  },
            ],
            '/operation/': [
              {
                  // title: "快速上手",
                  // icon: "creative",
                  // prefix: "get-started/",
                  // collapsable: true,
                  children: ["","top", "ps","pidstat","vmstat","iostat"],
                },
          ],
        }
      }
  }