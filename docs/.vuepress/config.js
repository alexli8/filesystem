module.exports = {
    title: '文件系统与优化',
    description: 'file system',
    themeConfig: {
        nav: [
          { text: '主页', link: '/' },
          { text: 'linux优化', link: '/operation/' },
          { text: 'Lustre', link: '/lustre/' },
          { text: 'openZFS', link: '/openzfs/' },
          { text: 'EOS', link: '/eos/' },
          
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
                  title: "优化分析",
                  // icon: "creative",
                  // prefix: "get-started/",
                  // collapsable: true,
                  children: ["","top", "ps","pidstat","vmstat","iostat","lsof","perf","strace","problem-cpu","problem-io"],
                },
          ],
        }
      }
  }