<template>

    <div class="card border">
        
        <div class="card-body accordion" role="tablist">

            <h2>{{ title }}</h2>
            
            <div v-for="(content, id) in contents" :key="id" class="mb-3">
                
                <div v-b-toggle="'accordion-' + id" class="position-relative border rounded pointer chevron py-3 pl-3 pr-4">
                    
                    {{ content.question }}
                
                </div>
                
                <b-collapse :id="'accordion-' + id" accordion="faq-accordion" role="tabpanel">
                    
                    <HtmlContent :html="content.answer" class="mt-3 mx-3" />
                
                </b-collapse>
            
            </div>
        
        </div> <!-- card-body.accordion ends -->
        
    </div> <!-- card ends -->

</template>

<script>
import HtmlContent from '../components/HtmlContent'

export default {
    components: {
        HtmlContent
    },
    props: {
        title: {
            type: String,
            default: "Frequently Asked Questions (FAQ)"
        },
        contents: {
            type: Array,
            default: null,
        }
    }
}
</script>