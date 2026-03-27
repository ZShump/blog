console.log('正在生成配置...\n')

// 生成时间线数据
console.log('1/2 生成时间线数据...')
require('./generate-timeline.js')

// 生成导航和侧边栏配置
console.log('\n2/2 生成导航和侧边栏配置...')
require('./generate-nav-sidebar.js')

console.log('\n✓ 所有配置生成完成！')
