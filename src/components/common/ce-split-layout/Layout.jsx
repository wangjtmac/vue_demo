import Vue from 'vue'
import "./layout.less"
export default Vue.component('CeSplitLayout' ,{
    props : {
        'data' : {
            type : Array ,
            default : ()=>[]
        }
    },
    render(){
        return (
            <ul ref="container" class="ce-split">
                {
                    this.data.map(item => {
                        return (<li class='ce-split_item'>{item.label}</li>)
                    })
                }
            </ul>
        )
    }
})
