import { isNullOrUndef, isArray, isNull } from './../core/utils';
import { removeChild } from './utils';
import { componentToDOMNodeMap } from './rendering';
import {
	isVFragment,
	isVElement,
	isVComponent,
	isVTemplate,
	isVText
} from '../core/shapes';
import { poolVTemplate, recyclingEnabled } from './templates';

export function unmount(input, parentDom, lifecycle) {
	if (isVTemplate(input)) {
		unmountVTemplate(input, parentDom, lifecycle);
	} else if (isVFragment(input)) {
		unmountVFragment(input, parentDom, true, lifecycle);
	} else if (isVElement(input)) {
		unmountVElement(input, parentDom, lifecycle);
	} else if (isVComponent(input)) {
		unmountVComponent(input, parentDom, lifecycle);
	} else if (isVText(input)) {
		unmountVText(input, parentDom);
	}
}

function unmountVText(vText, parentDom) {
	if (parentDom) {
		removeChild(parentDom, vText._dom);
	}
}

function unmountVTemplate(vTemplate, parentDom, lifecycle) {
	const dom = vTemplate._dom;
	const templateReducers = vTemplate._tr;
	const unmount = templateReducers.unmount;

	if (!isNull(unmount)) {
		templateReducers.unmount(vTemplate, lifecycle);
	}
	if (!isNull(parentDom)) {
		removeChild(parentDom, dom);
	}
	if (recyclingEnabled) {
		poolVTemplate(vTemplate);
	}
}

export function unmountVFragment(vFragment, parentDom, removePointer, lifecycle) {
	const children = vFragment._children;
	const childrenLength = children.length;
	const pointer = vFragment._pointer;

	if (childrenLength > 0) {
		for (let i = 0; i < childrenLength; i++) {
			const child = children[i];

			if (isVFragment(child)) {
				unmountVFragment(child, parentDom, true, lifecycle);
			} else {
				unmount(child, parentDom, lifecycle);
			}
		}
	}
	if (parentDom && removePointer) {
		removeChild(parentDom, pointer);
	}
}

export function unmountVComponent(vComponent, parentDom, lifecycle) {
	const instance = vComponent._instance;
	let instanceHooks = null;
	let instanceChildren = null;

	if (!isNullOrUndef(instance)) {
		instanceHooks = instance._hooks;
		instanceChildren = instance._children;

		if (instance.render !== undefined) {
			instance.componentWillUnmount();
			instance._unmounted = true;
			componentToDOMNodeMap.delete(instance);
			unmount(instance._lastInput, null, lifecycle);
		}
	}
	const hooks = vComponent._hooks || instanceHooks;

	if (!isNullOrUndef(hooks)) {
		if (!isNullOrUndef(hooks.onComponentWillUnmount)) {
			hooks.onComponentWillUnmount(vComponent._dom, hooks);
		}
	}
	if (parentDom) {
		removeChild(parentDom, vComponent._dom);
	}
}

export function unmountVElement(vElement, parentDom, lifecycle) {
	const hooks = vElement._hooks;
	const dom = vElement._dom;

	if (!isNullOrUndef(hooks)) {
		if (!isNullOrUndef(hooks.onWillDetach)) {
			hooks.onWillDetach(vElement._dom);
		}
	}
	const children = vElement._children;

	if (!isNullOrUndef(children)) {
		if (isArray(children)) {
			for (let i = 0; i < children.length; i++) {
				unmount(children[i], null, lifecycle);
			}
		} else {
			unmount(children, null, lifecycle);
		}
	}
	if (parentDom) {
		removeChild(parentDom, dom);
	}
}

export function unmountVariableAsExpression(pointer) {
	return function unmountVariableAsExpression(vTemplate) {
		// TODO
	};
}

export function unmountVariableAsChildren(pointer, childrenType) {
	return function unmountVariableAsChildren(vTemplate) {
		// TODO
	};
}

export function unmountVariableAsText(pointer) {
	return function unmountVariableAsText(vTemplate, parentDom) {
		debugger;
	};
}