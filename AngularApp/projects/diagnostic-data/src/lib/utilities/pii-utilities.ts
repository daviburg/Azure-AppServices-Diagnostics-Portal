export class PIIUtilities {
    public static removePII(text: string) {
        let res = text;
        try {
            res = this.maskPhone(res);
            res = this.maskEmails(res);
            res = this.maskIPV4Address(res);
            res = this.maskPassword(res);
            res = this.maskQueryString(res);
        } catch (e) {

        }
        return res;
    }

    public static maskPhone(text: string) {
        const regex = /(\+?\d?\d?\d?)([\d\-)\(\s]{10})/g;
        return text.replace(regex, " ********** ");
    }

    public static maskEmails(text: string) {
        const regex = /(?<=[\w]{1})[\w-\._\+%]*(?=@([\w-_]+)[\.]{0})/g;
        return text.replace(regex, s => "*".repeat(s.length));
    }

    public static maskIPV4Address(text: string) {
        const regex = /(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])/g;
        return text.replace(regex, s => s.split(".")[0] + '.' + s.split(".")[1] + '.' + s.split(".")[2] + '.XXX'
        );
    }

    public static maskPassword(text: string) {
        const regex = /(?<=(\bpass\b)|(\bpwd\b)|(\bpassword\b)|(\buserpass\b))[^\w\r\n]+(.+)/gi;
        return text.replace(regex, ":****");
    }

    public static maskQueryString(text: string) {
        const regex = /(?<=https?:\/\/[\w\.-_%]+\?)([\w-\._&%]+=[\w-\._%]+)+/g;
        return text.replace(regex,"****");
    }   
}