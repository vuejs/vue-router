import Vue from 'vue'
import VueRouter from '../../../src/index'

Vue.use(VueRouter)

describe('currentRoute', () => {
  describe('children[]', () => {
    it('should work', () => {
      const router = new VueRouter({
        routes:
        [
          {
            path: '/jobs',
          },
          {
            path: '/setup',
            children:
            [
              {
                path: 'lists',
              },
              {
                path: 'periods',
              }
            ]
          }
        ]
      })
  
      router.push('/setup')
  
      expect(router.currentRoute.fullPath).toEqual('/setup')
      expect(router.currentRoute.children.length).toEqual(2)
      expect(router.currentRoute.children[0].path).toEqual('lists')
      expect(router.currentRoute.children[1].path).toEqual('periods')
      expect(router.currentRoute.children[1].fullPath).toEqual(undefined)
    })
  })

  describe('parent', () => {
    it('should work', () => {
      const router = new VueRouter({
        routes:
        [
          {
            path: '/jobs',
          },
          {
            path: '/setup',
            children:
            [
              {
                path: '/',
                redirect: 'lists'
              },
              {
                path: 'lists',
              },
              {
                path: 'periods',
              }
            ]
          }
        ]
      })
  
      router.push('/setup/lists')
  
      expect(router.currentRoute.fullPath).toEqual('/setup/lists')
      expect(router.currentRoute.children.length).toEqual(0)
      expect(router.currentRoute.parent.children.length).toEqual(3)
      expect(router.currentRoute.parent.children[0].path).toEqual('/')
      expect(router.currentRoute.parent.children[2].path).toEqual('periods')
      expect(router.currentRoute.parent.children[2].fullPath).toEqual(undefined)
      expect(router.currentRoute.parent.fullPath).toEqual(undefined)
    })
  })
})