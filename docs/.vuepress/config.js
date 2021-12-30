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
                    title: "Lustre文件系统",
                    icon: "creative",
                    // prefix: "get-started/",
                    // collapsable: true,
                    children: ["","1", "2", "3","4"],
                  },
            ],
            '/operation/': [
              {
                  title: "优化分析",
                  // icon: "creative",
                  // prefix: "get-started/",
                  // collapsable: true,
                  children: ["","top", "ps","pidstat","vmstat","iostat","lsof","perf","problem-cpu","problem-io"],
                },
          ],
        }
      }
  }