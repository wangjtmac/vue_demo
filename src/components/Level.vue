<script>
    export default {
        name: "Level" ,
        props : {
            level : {
                type : Number ,
                required : true
            },
            title : {
                type : String ,
                required  :true
            }
        },
        render(createElement, hack) {
            return createElement(
                'h' + this.level ,
                [
                    createElement(
                        'a' ,
                        {
                            domProps : {
                                href : "#" + this.title
                            }
                        },
                        this.$slots.default
                    )
                ]
            )
        }
    }
</script>

<style scoped>

</style>