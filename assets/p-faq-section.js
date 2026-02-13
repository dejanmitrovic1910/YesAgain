function espCustomSectionFAQ(custom_section) {
  
  'use strict';
  
  let elements = {
    faqSection: custom_section,
    sidebar: custom_section.querySelector('.sidebar'),
    faqElements: custom_section.querySelectorAll('.faq-elem'),
    categories: custom_section.querySelectorAll('.category-item'),
    searchInput: custom_section.querySelector('#myInputSearch'),
    clearSearchButton: custom_section.querySelector('#faq-clear-search'),
    notFound: custom_section.querySelector('#notfound')
  };
  
  initFAQ();
  
  function initFAQ() {
    if (!elements.faqSection) return;
    initCategories();
    initQuestions();
    if (elements.searchInput) {
      initSearch();
    }
  }
  
  function initCategories() {
    if (!elements.categories.length) return;
    
    const firstCategory = elements.categories[0];
    const firstCategoryId = firstCategory.dataset.category;
    
    firstCategory.classList.add('active');
    
    filterFaqsByCategory(firstCategoryId);
    
    elements.categories.forEach(category => {
      category.addEventListener('click', (e) => {
        if(window.screen.width < 769) {
          if(category.classList.contains('active')) {
            elements.categories.forEach(cat => cat.classList.toggle('show'));
          } else {
            elements.categories.forEach(cat => cat.classList.remove('show'));
          }
        }
        elements.categories.forEach(cat => cat.classList.remove('active'));
        category.classList.add('active');
        filterFaqsByCategory(category.dataset.category);
      });
    });
  }
  
  function filterFaqsByCategory(categoryId) {
    
    if (!elements.faqElements.length) return;
    
    elements.faqElements.forEach(faq => {
      if (faq.dataset.category === categoryId) {
        faq.style.display = 'block';
      } else {
        faq.style.display = 'none';
      }
    });
  }
  
  function initQuestions() {
    const questions = elements.faqSection.querySelectorAll('.question');
    
    questions.forEach(question => {
      question.addEventListener('click', () => {
        question.closest('.faq-elem').classList.toggle('active');
      });
    });
  }
  
  function initSearch() {
    let searchTimeout;
    
    elements.searchInput.addEventListener('input', (e) => {
      
      if (e.target.value.length > 0) {
        elements.clearSearchButton.classList.add('active-state');
        const searchText = e.target.value.toLowerCase();
        searchFAQs(searchText);
      } else {
        elements.clearSearchButton.classList.remove('active-state');
        elements.sidebar.classList.remove('hide');
        elements.categories.forEach(category => {
          category.classList.remove('hide');
        });
        elements.faqElements.forEach(faq => {
          faq.classList.remove('hide');
        });
        elements.notFound.style.display = 'none';
      }

    });

    elements.clearSearchButton.addEventListener('click', function() {
      elements.searchInput.value = '';
      let event = new Event('input', {
        bubbles: true,
      });
      elements.searchInput.dispatchEvent(event);
    });
  }
  
  function searchFAQs(searchText) {

    console.log('searchText = '+searchText);

    let found = false;
    elements.notFound.style.display = 'none';
      
    elements.categories.forEach(category => {
      category.classList.add('hide');
    });

    let categoriesVisible = false;

    elements.faqElements.forEach(faq => {
      const question = faq.querySelector('.question').textContent.toLowerCase();
      const answer = faq.querySelector('.answer').textContent.toLowerCase();

      if (question.includes(searchText) || answer.includes(searchText)) {
        faq.classList.remove('hide');
        found = true;
        
        let questionCategory = faq.dataset.category;
        if(questionCategory) elements.categories.forEach(function(category) {
          if(category.dataset.category == questionCategory) {
            category.classList.remove('hide');
            categoriesVisible = true;
          }
        });
        
      } else {
        faq.classList.add('hide');
      }

      if(categoriesVisible) {
        let changed = false;
        elements.categories.forEach(function(category) {
          if(!category.classList.contains('hide') && !changed) {
            category.click();
            changed = true;
          }
        });
        elements.sidebar.classList.remove('hide');
      } else {
        elements.sidebar.classList.add('hide');
      }
    });

    if (!found && searchText.length > 0) {
      elements.notFound.style.display = 'block';
    }
  }
                           
}