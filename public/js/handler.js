function main(){
    const tweet_share = document.getElementById("tweet_share");
    const email_share = document.getElementById("email_share");
    const print = document.getElementById("print");
    tweet_share.href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent("Look at this recipe I found! \n" + window.location.href);
    tweet_share.innerText = "Tweet";
    email_share.href = "mailto:?subject=Look at this cool recipe!&body=" + encodeURIComponent("Look at this recipe I found! \n" + window.location.href);
    email_share.innerText = "Email";
    print.href = "javascript:recipe_print()";
    print.innerText = "Print";
}

const recipe_print = () => {
    const content = document.getElementById('content');
    const name = document.getElementById('name');
    const author = document.getElementById('author');
    const print_window = window.open('', '', 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0');
    print_window.document.write(`<h1>${name.innerHTML}</h1>`);
    print_window.document.write(`<h3>${author.innerHTML}</h3>`);
    print_window.document.write(content.innerHTML);
    print_window.print();
    print_window.document.close();
}