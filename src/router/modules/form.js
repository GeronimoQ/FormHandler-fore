export default aboutForm;

const formCreator=()=>import("@/components/form-designer")

function aboutForm() {
    return [{
        path: "/form",
        name: "form",
        meta: {
            title: "about forms"
        },
        children: [
            {
                path: "creator",
                meta: {
                    title: "模板组件"
                },
                component:formCreator
            }
        ]
    }]
}