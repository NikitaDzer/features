const DeepProxy = (grandpa = [], effect = {}) => {
  
  const transformedEffect = {...effect}
  transformedEffect.set = (target, prop, value) => {

    if (prop !== 'length') {
      const set = effect.set
      const result = set.before && set.before(target, prop, value, _grandpa_)
      const [_target_, _prop_, _value_] = result && result.length === 3 ? result : [target, prop, value]

      if (result !== false) {
        if (isLinkable(_value_)) {
          _target_[_prop_] = recursion(_value_)
        } else {
          _target_[_prop_] = _value_
        }
      }

      set.after && set.after(_target_, _prop_, _target_[_prop_], _grandpa_)
    }

    return true             
  }

  const recursion = parent => {
    for (let child in parent) {
      if (isLinkable(parent[child])) {
        parent[child] = recursion(parent[child])
      }
    }

    return createProxy(parent)
  }
  const createProxy = element => {
    return new Proxy(element, transformedEffect)
  }
  const isLinkable = element => typeof element === 'object' && !(element instanceof Text) && !(element instanceof Element)
  const _grandpa_ = recursion(grandpa)

  return _grandpa_
}
