<x-mail::message>
@if($lang === 'ar')
# شكراً {{ $signup->admin_name }}!

توصلنا بطلبكم للتجربة المجانية لـ {{ $brand }} ({{ ucfirst($signup->plan) }}) لفائدة **{{ $signup->company }}**.

سيتصل بكم مستشار خلال يوم عمل واحد لإنشاء فضائكم وإرسال بيانات الدخول. التجربة مجانية لمدة **{{ $trialDays }} يوماً** بدون التزام.

في انتظار ذلك، يمكنكم مشاهدة [فيديوهات التكوين]({{ $siteUrl }}/ar/formation) أو مراجعة [الأسئلة الشائعة]({{ $siteUrl }}/ar/faq).

فريق {{ $brand }}
@elseif($lang === 'en')
# Thank you, {{ $signup->admin_name }}!

We have received your {{ $brand }} free trial request ({{ ucfirst($signup->plan) }} plan) for **{{ $signup->company }}**.

An advisor will contact you within one working day to create your workspace and send you your access. The trial is free for **{{ $trialDays }} days**, no commitment.

In the meantime, have a look at the [training videos]({{ $siteUrl }}/en/formation) or the [FAQ]({{ $siteUrl }}/en/faq).

The {{ $brand }} team
@else
# Merci {{ $signup->admin_name }} !

Nous avons bien reçu votre demande d'essai gratuit {{ $brand }} (forfait {{ ucfirst($signup->plan) }}) pour **{{ $signup->company }}**.

Un conseiller vous contacte sous un jour ouvré pour créer votre espace et vous envoyer vos accès. L'essai est gratuit pendant **{{ $trialDays }} jours**, sans engagement.

En attendant, vous pouvez regarder les [vidéos de formation]({{ $siteUrl }}/formation) ou consulter la [FAQ]({{ $siteUrl }}/faq).

L'équipe {{ $brand }}
@endif
</x-mail::message>
