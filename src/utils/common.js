

export const common = {

    translateNameEn(sources, nameEn) {
        let nameCn
        sources.forEach(source => {
            if (source.nameEn === nameEn) {
                nameCn = source.nameCn
            }
        })
        return nameCn
    },

    translateDepartmentsFromIds(departments, ids) {
        let res = []
        departments.forEach(department => {
            if (-1 !== ids.indexOf(department.value)) {
                res.push(department.label)
            }
            if (0 !== department.children.length) {
                this.translateDepartmentsFromIds(department.children, ids).forEach(inner => {
                    res.push(inner)
                })
            }
        })
        return res
    },
}