const LocalStorage = (() => {
   const storage = localStorage,
   format = JSON,
   DeepProxy=(a=[],b={})=>{const c={...b,set:(a,c,e)=>{if("length"!==c){const h=b.set,i=h.before&&h.before(a,c,e,g),[j,k,l]=i&&3===i.length?i:[a,c,e];!1!==i&&(f(l)?j[k]=d(l):j[k]=l),h.after&&h.after(j,k,j[k],g)}return!0}},d=a=>{for(let b in a)f(a[b])&&(a[b]=d(a[b]));return e(a)},e=a=>new Proxy(a,c),f=a=>"object"==typeof a,g=d(a);return g}

   return key => ({
     set(item) {
       console.time('set')
       storage.setItem(key, format.stringify(item))
       console.timeEnd('set')
     },

     get() {
       console.time('get')
       const item = format.parse(storage.getItem(key))
       console.timeEnd('get')
       return item
     },

     remove() {
       console.time('remove')
       storage.removeItem(key)
       console.timeEnd('remove')
     },

     clear() {
       console.time('clear')
       storage.clear()
       console.timeEnd('clear')
     },

     sync(target) {
       console.time('sync')
       const self = this
       target = DeepProxy(target, {
         set: {
           after: () => self.set(target)
         }
       })
       self.set(target)
       console.timeEnd('sync')
       return target
     }
 })})()
